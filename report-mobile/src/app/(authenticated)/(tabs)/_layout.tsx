import React, { useEffect } from "react"
import { Href, Redirect, Tabs, useRouter } from "expo-router"
import { useAuth } from "@/providers/AuthProvider"
import FontAwesome from "@expo/vector-icons/FontAwesome"

const AuthenticatedTabLayout = () => {
  const { session, loading } = useAuth()
  const router = useRouter()


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
