import { Stack } from "expo-router";

export default function EducatorClassesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[classId]" />
    </Stack>
  );
}
