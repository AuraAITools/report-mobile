import { env } from "@/utils/env";
import Axios, { InternalAxiosRequestConfig, AxiosError } from "axios";
import { AuraSecureStore } from "./secure-store";
import { AccessTokenUtils } from "@/types/auth/AccessToken";
import { getTokenRefresher, setTokenRefresher } from "./auth/token-refresher";

export { setTokenRefresher };

export const apiClient = Axios.create({
  baseURL: env.reportApiUrl,
});

// --- Token refresh state (module-scoped, outside React) ---
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });
  failedQueue = [];
};

// --- Request interceptor: proactive refresh if token is near expiry ---
async function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  const store = AuraSecureStore.getInstance();
  let token = await store.getValueFor("access_token");

  if (token) {
    try {
      const decoded = AccessTokenUtils.decodeJWT(token);
      const timeLeft = AccessTokenUtils.getTimeUntilExpiration(decoded);

      // Proactively refresh if less than 60 seconds remain
      const refresher = getTokenRefresher();
      if (timeLeft < 60 && refresher) {
        const newToken = await refresher();
        if (newToken) {
          token = newToken;
        }
      }
    } catch {
      // Token decode failed; let the 401 interceptor handle it
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers.Accept = "application/json";
  config.headers["Content-Type"] = "application/json";

  // Send active tenant ID if available
  const tenantId = await store.getValueFor("active_tenant_id");
  if (tenantId) {
    config.headers["X-Tenant-ID"] = tenantId;
  }

  return config;
}

apiClient.interceptors.request.use(authRequestInterceptor);

// --- Response interceptor: queue-based 401 retry ---
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue this request until the in-flight refresh completes
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refresher = getTokenRefresher();
      if (!refresher) {
        throw new Error("No token refresher configured");
      }
      const newToken = await refresher();
      if (!newToken) {
        throw new Error("Token refresh returned null");
      }
      processQueue(null, newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as Error, null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
