import { useAuth } from "@/components/providers/AuthProvider";
import { AccountsApis } from "@/lib/hooks/accounts-queries";
import { Link } from "expo-router";
import React from "react";
import { Text, ScrollView, StyleSheet } from "react-native";

export default function AccountsPage() {
  const { tenant_ids, userInfo } = useAuth();
  console.log("tenant_ids", tenant_ids.at(0));
  const { data: account, isPending } =
    AccountsApis.useGetAllExpandedAccountsOfUserInInstitution(
      tenant_ids.at(0),
      userInfo?.sub
    );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.h1}>Welcome to Aura</Text>
      <Text style={styles.section}>Select an account to begin</Text>
      {/* Educator Accounts section */}
      {isPending && <Text>Loading...</Text>}
      {account && <Link href="parent-client/(tabs)">{account.first_name}</Link>}
      <Link href="parent-client/(tabs)">Educator Account</Link>
      {/* Parent Accounts section -> show each student  */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
