import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BiometricService } from "@/lib/auth/biometric-service";
import { useAuth } from "@/components/providers/AuthProvider";

export default function LockScreen() {
  const { logoutUser } = useAuth();

  async function unlockWithBiometrics() {
    const service = BiometricService.getInstance();
    await service.authenticate("Verify your identity to unlock");
  }

  return (
    <View style={styles.container}>
      <Ionicons
        name="lock-closed"
        size={72}
        color="#6366F1"
        style={styles.icon}
      />
      <Text style={styles.title}>App Locked</Text>
      <Text style={styles.subtitle}>
        Verify your identity to continue
      </Text>

      <Pressable
        style={styles.unlockButton}
        onPress={unlockWithBiometrics}
      >
        <Ionicons name="finger-print" size={22} color="#FFFFFF" />
        <Text style={styles.unlockButtonText}>Unlock with Biometrics</Text>
      </Pressable>

      <Pressable style={styles.signOutLink} onPress={() => logoutUser()}>
        <Text style={styles.signOutText}>
          Sign in with a different account
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    backgroundColor: "#FFFFFF",
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 40,
  },
  unlockButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6366F1",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    gap: 10,
  },
  unlockButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  signOutLink: {
    marginTop: 24,
    padding: 8,
  },
  signOutText: {
    color: "#6366F1",
    fontSize: 14,
    fontWeight: "500",
  },
});
