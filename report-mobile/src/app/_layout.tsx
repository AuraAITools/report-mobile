import FontAwesome from "@expo/vector-icons/FontAwesome"
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native"
import { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { useFonts } from "expo-font"
import { Stack, useRouter } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react"

import { useColorScheme } from "@components/useColorScheme"
import { Ionicons } from "@expo/vector-icons"
import { TouchableOpacity, StyleSheet } from "react-native"
import Dropdown from "@/components/ui/Dropdown"

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router"

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  })

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return <RootLayoutNav />
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  const headerOptions = (
    title: string,
    showLeftHeader: boolean,
    showRightHeader: boolean
  ): NativeStackNavigationOptions => {
    return {
      title,
      headerLeft: showLeftHeader
        ? (props) => (
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <Ionicons name='arrow-back' size={24} color='white' />
            </TouchableOpacity>
          )
        : undefined,
      headerRight: showRightHeader
        ? (props) => (
            <Dropdown
              items={[{ value: "test1" }, { value: "test2" }]}
            ></Dropdown>
          )
        : undefined,
      headerTitleAlign: "center",
    }
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName='index'>
        <Stack.Screen name='index' options={{ headerShown: false }} />

        <Stack.Screen
          name='(authenticated)/(parents)/[parent_id]'
          options={headerOptions("Institutions", true, true)}
        />
        <Stack.Screen
          name='(authenticated)/(parents)/classes/index'
          options={headerOptions("Classes", true, true)}
        />

        <Stack.Screen
          name='(authenticated)/accounts/[user_id]'
          options={headerOptions("Accounts", false, false)}
        />
        <Stack.Screen
          name='(authenticated)/(institutions)/[institution_id]'
          options={headerOptions("Institutions", true, true)}
        />
        <Stack.Screen name='modal' options={{ presentation: "modal" }} />
      </Stack>
    </ThemeProvider>
  )
}

const styles = StyleSheet.create({
  backButton: {
    padding: 8,
  },
})
