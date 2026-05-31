import { useAuth } from "@/components/providers/AuthProvider";
import { useGetMyAccountInInstitution } from "@/features/account";
import { Link } from "expo-router";
import React from "react";
import { Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountsPage() {
  const { tenant_ids, userInfo } = useAuth();
  const institutionId = tenant_ids.at(0);

  const { data: account, isPending } = useGetMyAccountInInstitution(
    institutionId,
    userInfo?.sub,
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.h1}>Welcome to Aura</Text>
        <Text style={styles.section}>Select an account to begin</Text>
        {isPending && <Text>Loading...</Text>}
        {account && (
          <Link href="/(authenticated)/parent-client/(tabs)">
            {account.firstName}
          </Link>
        )}
        <Link href="/(authenticated)/parent-client/(tabs)">Educator Account</Link>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 8,
  },
  h1: {
    fontSize: 36,
    fontWeight: "bold",
  },
  section: {
    fontSize: 14,
    paddingVertical: 4,
  },
});
