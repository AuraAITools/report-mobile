import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export default function AccountScreen() {
  const { logoutUser } = useAuth();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["top", "left", "right"]}
    >
      <View className="flex-1 items-center justify-center" testID="account-screen">
        <Button
          onPress={logoutUser}
          className="w-64 max-w-sm"
          testID="sign-out-button"
        >
          <Text>Log Out</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
