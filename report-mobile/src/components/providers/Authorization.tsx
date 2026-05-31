import React, { PropsWithChildren } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "./AuthProvider";

export type AuthorizationProps = {
  allowedRoles?: string[];
  hideContent?: boolean;
} & PropsWithChildren;

/**
 * Authentication and Authorization by RBAC enforcement.
 * If undefined or an empty array of allowedRoles is passed, authorisation is not enforced.
 */
export default function Authorization({
  hideContent,
  children,
  allowedRoles,
}: AuthorizationProps) {
  const { isAuthenticated, roles, tenant_ids, loginUser } = useAuth();

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Ionicons
          name="lock-closed-outline"
          size={64}
          color="#F59E0B"
          style={styles.icon}
        />
        <Text style={styles.title}>Session Expired</Text>
        <Text style={styles.subtitle}>
          Your session has expired. Please sign in again.
        </Text>
        <Pressable style={styles.button} onPress={() => loginUser()}>
          <Text style={styles.buttonText}>Sign In</Text>
        </Pressable>
      </View>
    );
  }

  if (!allowedRoles || allowedRoles.length === 0) {
    return <>{children}</>;
  }

  const allowedTenantAwareRoles = allowedRoles.map(
    (r) => `${tenant_ids[0]}_${r}`
  );

  const canAccess = allowedTenantAwareRoles.some((allowedRole) =>
    roles.includes(allowedRole)
  );

  if (!canAccess && hideContent) {
    return null;
  }

  if (!canAccess) {
    return (
      <View style={styles.container}>
        <Ionicons
          name="warning-outline"
          size={64}
          color="#F59E0B"
          style={styles.icon}
        />
        <Text style={styles.title}>Access Denied</Text>
        <Text style={styles.subtitle}>
          You need one of the following roles to access this content:
        </Text>
        {allowedRoles.map((role, idx) => (
          <View key={idx} style={styles.roleItem}>
            <Text style={styles.roleBullet}>{"\u2022"}</Text>
            <Text style={styles.roleText}>{role}</Text>
          </View>
        ))}
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#F59E0B",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  roleItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  roleBullet: {
    fontSize: 16,
    color: "#6B7280",
    marginRight: 8,
  },
  roleText: {
    fontSize: 14,
    color: "#374151",
  },
});
