import "@/global.css";
import "@/i18n";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "expo-router/react-navigation";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { PropsWithChildren, useEffect } from "react";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme } from "@components/useColorScheme";
import AuthProvider, { useAuth } from "@/components/providers/AuthProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import NotificationProvider from "@/components/providers/NotificationProvider";
import LockScreen from "@/components/ui/LockScreen";
import OfflineBanner from "@/components/ui/feedback/OfflineBanner";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { initSentry } from "@/lib/sentry";

export {
  ErrorBoundary,
} from "expo-router";

// Initialize Sentry
initSentry();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <QueryProvider>
          <AuthProvider>
            <NotificationProvider>
              <NetworkStatusBanner />
              <AuthGate>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(auth)" />
                  <Stack.Screen
                    name="(authenticated)"
                    options={{ title: "Navigation" }}
                  />
                </Stack>
              </AuthGate>
            </NotificationProvider>
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function AuthGate({ children }: PropsWithChildren) {
  const { isLocked } = useAuth();

  if (isLocked) {
    return <LockScreen />;
  }

  return <>{children}</>;
}

function NetworkStatusBanner() {
  const { isConnected } = useNetworkStatus();

  if (isConnected === false) {
    return <OfflineBanner />;
  }

  return null;
}
