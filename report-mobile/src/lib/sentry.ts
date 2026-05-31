import * as Sentry from "@sentry/react-native";

export function initSentry() {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || "",
    enabled: !__DEV__,
    tracesSampleRate: 0.2,
    environment: process.env.EXPO_PUBLIC_APP_ENV || "development",
  });
}

export { Sentry };
