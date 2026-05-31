import type { DocumentTypeDecoration } from "@graphql-typed-document-node/core";
import { env } from "@/utils/env";
import { AuraSecureStore } from "./secure-store";
import { AccessTokenUtils } from "@/types/auth/AccessToken";
import { getTokenRefresher } from "./auth/token-refresher";

const GRAPHQL_ENDPOINT = `${env.reportApiUrl.replace(/\/+$/, "")}/graphql`;

type GraphQLResponseError = { message: string };

type GraphQLResponse<TResult> = {
  data?: TResult;
  errors?: ReadonlyArray<GraphQLResponseError>;
};

export class GraphQLClientError extends Error {
  constructor(
    message: string,
    public readonly graphQLErrors?: ReadonlyArray<GraphQLResponseError>,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "GraphQLClientError";
  }
}

// --- Token refresh state (module-scoped, mirrors api-client.ts) ---
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

function processQueue(error: Error | null, token: string | null) {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token!);
  });
  failedQueue = [];
}

async function getCurrentAccessToken(): Promise<string | null> {
  const store = AuraSecureStore.getInstance();
  let token = await store.getValueFor("access_token");
  if (!token) return null;

  try {
    const decoded = AccessTokenUtils.decodeJWT(token);
    const timeLeft = AccessTokenUtils.getTimeUntilExpiration(decoded);
    const refresher = getTokenRefresher();
    if (timeLeft < 60 && refresher) {
      const refreshed = await refresher();
      if (refreshed) token = refreshed;
    }
  } catch {
    // Decode failed; let the 401 path handle it
  }
  return token;
}

async function buildHeaders(token: string | null): Promise<Headers> {
  const headers = new Headers({
    "Content-Type": "application/json",
    Accept: "application/graphql-response+json, application/json",
  });
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const store = AuraSecureStore.getInstance();
  const tenantId = await store.getValueFor("active_tenant_id");
  if (tenantId) headers.set("X-Tenant-ID", tenantId);

  return headers;
}

async function refreshAndDequeue(): Promise<string> {
  const refresher = getTokenRefresher();
  if (!refresher) {
    const err = new Error("No token refresher configured");
    processQueue(err, null);
    throw err;
  }
  try {
    const newToken = await refresher();
    if (!newToken) throw new Error("Token refresh returned null");
    processQueue(null, newToken);
    return newToken;
  } catch (e) {
    processQueue(e as Error, null);
    throw e;
  }
}

async function sendRequest(
  body: string,
  token: string | null,
  signal: AbortSignal | undefined,
): Promise<Response> {
  const headers = await buildHeaders(token);
  return fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers,
    body,
    signal,
  });
}

export async function graphqlClient<TResult, TVariables>(
  document: DocumentTypeDecoration<TResult, TVariables>,
  ...[variables, signal]: TVariables extends Record<string, never>
    ? [variables?: undefined, signal?: AbortSignal]
    : [variables: TVariables, signal?: AbortSignal]
): Promise<TResult> {
  const body = JSON.stringify({
    query: document.toString(),
    variables,
  });

  let response: Response;
  try {
    const token = await getCurrentAccessToken();
    response = await sendRequest(body, token, signal);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    const message = error instanceof Error ? error.message : "Network error";
    notifyError(message);
    throw new GraphQLClientError(message);
  }

  // 401 → queue-based refresh + single retry
  if (response.status === 401) {
    let retryToken: string;
    if (isRefreshing) {
      retryToken = await new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });
    } else {
      isRefreshing = true;
      try {
        retryToken = await refreshAndDequeue();
      } catch (refreshError) {
        const message =
          refreshError instanceof Error ? refreshError.message : "Token refresh failed";
        notifyError(message);
        throw new GraphQLClientError(message, undefined, 401);
      } finally {
        isRefreshing = false;
      }
    }

    try {
      response = await sendRequest(body, retryToken, signal);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") throw error;
      const message = error instanceof Error ? error.message : "Network error";
      notifyError(message);
      throw new GraphQLClientError(message);
    }
  }

  if (!response.ok) {
    const message = `GraphQL request failed: ${response.status} ${response.statusText}`;
    notifyError(message);
    throw new GraphQLClientError(message, undefined, response.status);
  }

  const json = (await response.json()) as GraphQLResponse<TResult>;

  if (json.errors?.length) {
    const message = json.errors.map((e) => e.message).join("; ");
    notifyError(message);
    throw new GraphQLClientError(message, json.errors);
  }

  if (json.data === undefined) {
    const message = "GraphQL response contained no data";
    notifyError(message);
    throw new GraphQLClientError(message);
  }

  return json.data;
}

function notifyError(message: string) {
  // Wire to your toast lib of choice (e.g. burnt, sonner-native).
  if (__DEV__) console.warn("[graphqlClient]", message);
}
