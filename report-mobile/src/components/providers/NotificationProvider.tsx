import React, { PropsWithChildren, useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useTokenRefresh } from "@/lib/notifications/useTokenRefresh";
import { registerNotificationCategories } from "@/lib/notifications/notification-categories";

type NotificationData = {
  url?: string;
  type?: string;
  [key: string]: unknown;
};

function handleNotificationNavigation(
  router: ReturnType<typeof useRouter>,
  data: NotificationData,
  actionId?: string
) {
  if (data.url) {
    router.push(data.url as never);
    return;
  }

  switch (data.type) {
    case "LESSON_UPDATE":
      router.push("/(authenticated)/parent-client/lessons" as never);
      break;
    case "PROGRESS_UPDATE":
      router.push("/(authenticated)/parent-client/progress" as never);
      break;
    default:
      router.push("/(authenticated)" as never);
      break;
  }
}

export default function NotificationProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useTokenRefresh();

  useEffect(() => {
    registerNotificationCategories().catch((error) => {
      console.error("Failed to register notification categories:", error);
    });

    // Foreground notification listener
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.debug(
          "Notification received in foreground:",
          notification.request.identifier
        );
      });

    // Notification response listener (user tapped)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content
          .data as NotificationData;
        const actionId = response.actionIdentifier;
        handleNotificationNavigation(router, data, actionId);
      });

    // Cold-start: check if app was opened from a notification
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        const data = response.notification.request.content
          .data as NotificationData;
        const actionId = response.actionIdentifier;
        handleNotificationNavigation(router, data, actionId);
      }
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [router]);

  return <>{children}</>;
}
