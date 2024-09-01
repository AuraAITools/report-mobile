import React, { useEffect } from "react"
import { useAuth } from "@/providers/AuthProvider"
import { ActivityIndicator } from "react-native"
import { Href, Redirect } from "expo-router";

export default function Index() {
  const auth = useAuth()
  useEffect(()=> {
    auth.loadUserSessionFromSecureStorageToMemory()
  },[]);
  
  if (auth.loading) {
    return <ActivityIndicator />
  }

  if (!auth.session) {
    console.debug(`no session. index redirecting to auth/home`)
    return <Redirect href={`/(auth)/home` as Href<String>} />
  }
  console.debug(`session found. redirecting to /(authenticated)/(tabs)/home`)
  return <Redirect href={"/(authenticated)/(tabs)/home" as Href<String>} />
}
