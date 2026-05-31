import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function EducatorTabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue", headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarButtonTestID: "edu-tab-home",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome size={size} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="lessons"
        options={{
          title: "Lessons",
          tabBarButtonTestID: "edu-tab-lessons",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome size={size} name="book" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="classes"
        options={{
          title: "Classes",
          tabBarButtonTestID: "edu-tab-classes",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome size={size} name="users" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="students"
        options={{
          title: "Students",
          tabBarButtonTestID: "edu-tab-students",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome size={size} name="graduation-cap" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: "Accounts",
          tabBarButtonTestID: "edu-tab-accounts",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome size={size} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
