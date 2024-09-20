import React, { useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Href, Redirect } from "expo-router";

export default function Index() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    console.debug(`not authenticated. index redirecting to /(auth)/home`);
    return <Redirect href={`/(auth)/home` as Href<String>} />;
  }

  console.debug(`authenticated. index redirecting to /(authenticated)/(tabs)/home`);
  return <Redirect href={"/(authenticated)/(tabs)/home" as Href<String>} />;
}
