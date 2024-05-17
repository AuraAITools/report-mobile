import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { useColorScheme } from '@components/useColorScheme';
import AuthProvider from '@/providers/AuthProvider';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
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
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <Stack initialRouteName='index'>
          <Stack.Screen name="index" options={{ headerShown: false }} />

          <Stack.Screen name='(authenticated)/(parents)/[parent_id]' options={{ title: "Institutions" }} />
          <Stack.Screen name='(authenticated)/(parents)/classes/index' options={{ title: "Classes" }} />
          <Stack.Screen name='(authenticated)/(parents)/subjects/index' options={{ title: "Subjects" }} />
          <Stack.Screen name='(authenticated)/(parents)/subjects/dashboard' options={{ title: "Dashboard" }} />

          <Stack.Screen name='(authenticated)/accounts/[user_id]' options={{ title: "Accounts" }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}
