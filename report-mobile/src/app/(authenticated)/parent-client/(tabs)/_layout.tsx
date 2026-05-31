import React, { useEffect } from "react";
import { Href, Redirect, Tabs, useRouter } from "expo-router";
import { useAuth } from "@/components/providers/AuthProvider";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const AuthenticatedTabLayout = () => {
  const router = useRouter();

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue", headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarButtonTestID: "tab-home",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome size={size} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="lessons"
        options={{
          title: "Lessons",
          tabBarButtonTestID: "tab-lessons",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome size={size} name="book" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarButtonTestID: "tab-progress",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome size={size} name="line-chart" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarButtonTestID: "tab-account",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome size={size} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default AuthenticatedTabLayout;
