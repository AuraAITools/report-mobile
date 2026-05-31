import RegularButton from "@/components/ui/RegularButton";
import { useAuth } from "@/components/providers/AuthProvider";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { constmaxWidth, minWidth } from "@/constants/ScreenDimension";

export default function AccountScreen() {
  const { logoutUser } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.container} testID="account-screen">
        <Text></Text>
        <RegularButton
          label="Log Out"
          textStyle={styles.logoutButtonText}
          buttonStyle={styles.logoutButton}
          onPress={logoutUser}
          testID="sign-out-button"
        />
      </View>
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
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButton: {
    minWidth: minWidth,
    maxWidth: constmaxWidth,
    backgroundColor: "#000000",
    paddingVertical: 13,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
