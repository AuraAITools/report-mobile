import { useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { NotificationService } from "./notification-service";

export function useTokenRefresh(): void {
  const { isAuthenticated, userInfo } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !userInfo) {
      return;
    }

    async function checkAndRefreshToken() {
      const service = NotificationService.getInstance();
      const currentToken = service.expoPushToken;
      const storedToken = await service.getStoredToken();

      if (currentToken && currentToken !== storedToken) {
        console.debug("Push token changed, re-registering with backend.");
        await service
          .registerTokenWithBackend(userInfo!.sub)
          .catch((error) => {
            console.error("Failed to refresh push token:", error);
          });
      }
    }

    checkAndRefreshToken();
  }, [isAuthenticated, userInfo]);
}
