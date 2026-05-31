import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { apiClient } from "@/lib/api-client";
import { AuraSecureStore } from "@/lib/secure-store";

const PUSH_TOKEN_STORE_KEY = "expo_push_token";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  private static _instance: NotificationService;
  private _expoPushToken: string | null = null;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService._instance) {
      NotificationService._instance = new NotificationService();
    }
    return NotificationService._instance;
  }

  public get expoPushToken(): string | null {
    return this._expoPushToken;
  }

  public async registerForPushNotifications(): Promise<string | null> {
    if (!Device.isDevice) {
      console.warn(
        "Push notifications are not supported on simulators/emulators."
      );
      return null;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("Push notification permission not granted.");
      return null;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Default",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });

      await Notifications.setNotificationChannelAsync("lessons", {
        name: "Lessons",
        description: "Notifications related to lessons and schedules",
        importance: Notifications.AndroidImportance.HIGH,
      });

      await Notifications.setNotificationChannelAsync("progress", {
        name: "Progress",
        description: "Notifications related to student progress",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    if (!projectId) {
      console.error("Project ID is not configured.");
      return null;
    }

    const tokenResponse = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    this._expoPushToken = tokenResponse.data;
    return this._expoPushToken;
  }

  public async registerTokenWithBackend(userId: string): Promise<void> {
    if (!this._expoPushToken) {
      console.warn("No push token available to register.");
      return;
    }

    await apiClient.post("/notifications/devices", {
      token: this._expoPushToken,
      platform: Platform.OS,
      userId,
    });

    await AuraSecureStore.getInstance().save(
      PUSH_TOKEN_STORE_KEY,
      this._expoPushToken
    );
  }

  public async unregisterToken(): Promise<void> {
    const storedToken =
      await AuraSecureStore.getInstance().getValueFor(PUSH_TOKEN_STORE_KEY);

    if (storedToken) {
      await apiClient
        .delete("/notifications/devices", {
          data: { token: storedToken },
        })
        .catch((error) => {
          console.error("Failed to unregister token from backend:", error);
        });
    }

    await AuraSecureStore.getInstance().deleteItemFor(PUSH_TOKEN_STORE_KEY);
    this._expoPushToken = null;
  }

  public async getStoredToken(): Promise<string | null> {
    return AuraSecureStore.getInstance().getValueFor(PUSH_TOKEN_STORE_KEY);
  }
}

export { NotificationService, PUSH_TOKEN_STORE_KEY };
