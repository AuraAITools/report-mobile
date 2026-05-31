import * as Notifications from "expo-notifications";

export async function registerNotificationCategories(): Promise<void> {
  await Notifications.setNotificationCategoryAsync("LESSON_REMINDER", [
    {
      identifier: "GOT_IT",
      buttonTitle: "Got it",
      options: {
        opensAppToForeground: false,
      },
    },
    {
      identifier: "VIEW_DETAILS",
      buttonTitle: "View Details",
      options: {
        opensAppToForeground: true,
      },
    },
  ]);

  await Notifications.setNotificationCategoryAsync("PROGRESS_UPDATE", [
    {
      identifier: "VIEW_PROGRESS",
      buttonTitle: "View Progress",
      options: {
        opensAppToForeground: true,
      },
    },
  ]);

  await Notifications.setNotificationCategoryAsync("MESSAGE", [
    {
      identifier: "REPLY",
      buttonTitle: "Reply",
      options: {
        opensAppToForeground: false,
      },
      textInput: {
        submitButtonTitle: "Send",
        placeholder: "Type your reply...",
      },
    },
  ]);
}
