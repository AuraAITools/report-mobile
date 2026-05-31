import React, { useState } from "react";
import { Alert, View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handlePasswordReset = async () => {
    try {
      const status = 200;
      if (status === 200) {
        Alert.alert("Success", "Password reset successfully!", [
          { text: "OK", onPress: () => router.push("/(auth)/reset-password") },
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
    <View className="flex-1 bg-background p-4" testID="forgot-password-screen">
      <Text variant="h3" className="mb-8">
        Reset your password
      </Text>
      <Input
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your registered email address"
        keyboardType="email-address"
        autoCapitalize="none"
        className="mb-4"
        testID="email-input"
      />
      <Button onPress={handlePasswordReset} testID="reset-password-button">
        <Text>Send password reset link</Text>
      </Button>
    </View>
  );
};

export default ForgotPasswordScreen;
