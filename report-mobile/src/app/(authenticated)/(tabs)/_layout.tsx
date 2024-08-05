import React, { useEffect } from "react"
import { Href, Redirect, Tabs, useRouter } from "expo-router"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/providers/AuthProvider"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import NavigationTab from "@/components/ui/NavigationTab"

const AuthenticatedTabLayout = () => {
  const { session, loading } = useAuth()
  const router = useRouter()

  // if user is authenticated redirect to accounts screen
  // useEffect(() => {
  //   if (!loading && session) {
  //     router.replace(`(tabs)` as Href<string>)
  //   }
  // }, [session, loading])

  // async function signOut() {
  //   console.log("signing out")
  //   const { error } = await supabase.auth.signOut()
  //   if (error) {
  //     //TODO: include a error toast in the future
  //     console.log(error.message)
  //   }
  // }

  // // if not authenticated redirect to index page
  // if (!session) {
  //   return <Redirect href='/' />
  // }

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name='home'
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome size={size} name='home' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='lessons'
        options={{
          title: "Lessons",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome size={size} name='book' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='progress'
        options={{
          title: "Progress",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome size={size} name='line-chart' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='account'
        options={{
          title: "Account",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome size={size} name='user' color={color} />
          ),
        }}
      />
    </Tabs>
  )
}

export default AuthenticatedTabLayout
