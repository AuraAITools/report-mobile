import { Stack, useRouter, Redirect } from "expo-router";
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useAuth } from "@/components/providers/AuthProvider";
import { InstitutionsProvider } from "@/components/providers/InstitutionsProvider";
import { AccountProvider } from "@/components/providers/AccountProvider";

// expo-router picks this up automatically for this route group
export function ErrorBoundary({
  error,
  retry,
}: {
  error: Error;
  retry: () => void;
}) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.detail}>{error.message}</Text>
      <Pressable style={styles.button} onPress={retry}>
        <Text style={styles.buttonText}>Try again</Text>
      </Pressable>
      <Pressable onPress={() => router.replace("/(auth)/home")}>
        <Text style={styles.link}>Back to login</Text>
      </Pressable>
    </View>
  );
}

export default function AuthenticatedLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/home" />;
  }

  return (
    <InstitutionsProvider>
      <AccountProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="parent-client/(tabs)" options={{ title: "Home" }} />
        </Stack>
      </AccountProvider>
    </InstitutionsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  detail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  link: { color: "#3b82f6", fontSize: 14 },
});
