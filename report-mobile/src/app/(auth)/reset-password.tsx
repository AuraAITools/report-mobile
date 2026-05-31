import React, { useState } from "react";
import { Alert, View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Text } from "@/components/ui/text";

const ResetPasswordScreen: React.FC = () => {
  const [pin, setPin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      const status = 200;
      if (status === 200) {
        Alert.alert("Success", "Password reset successfully!", [
          { text: "OK", onPress: () => router.push("/(auth)/home") },
        ]);
      } else {
        Alert.alert("Error", "Failed to reset password. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <View className="flex-1 bg-background p-4">
      <Text variant="h3" className="mb-5">
        Reset your password
      </Text>
      <Text className="mb-5">
        An email containing the reset pin has been sent to your registered email
        address.
      </Text>
      <Input
        value={pin}
        onChangeText={setPin}
        placeholder="Enter password reset pin"
        keyboardType="numeric"
        className="mb-4"
      />
      <PasswordInput
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Enter a new password"
        containerClassName="mb-4"
      />
      <PasswordInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Re-enter the new password"
        containerClassName="mb-4"
      />
      <Button onPress={handlePasswordReset} className="mt-2">
        <Text>Reset password</Text>
      </Button>
    </View>
  );
};

export default ResetPasswordScreen;
