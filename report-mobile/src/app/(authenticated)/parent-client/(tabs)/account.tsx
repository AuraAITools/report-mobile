import RegularButton from "@/components/ui/RegularButton";
import { useAuth } from "@/components/providers/AuthProvider";
import { View, Text, StyleSheet } from "react-native";
import { constmaxWidth, minWidth } from "@/constants/ScreenDimension";

export default function AccountScreen() {
  const { logoutUser } = useAuth();

  return (
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
  );
}

const styles = StyleSheet.create({
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
