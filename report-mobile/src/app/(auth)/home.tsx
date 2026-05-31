import React from "react";
import { View } from "react-native";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

const SplashScreen: React.FC = () => {
  const auth = useAuth();

  return (
    <View
      className="flex-1 items-center justify-center bg-background p-4"
      testID="auth-home-screen"
    >
      <Text variant="h1" className="mb-5 w-4/5 shrink text-center">
        Better Learning Begins Here
      </Text>
      <Text className="mb-6 text-center text-base text-foreground/70">
        Start using Aura Learning
      </Text>
      <Button
        onPress={auth.loginUser}
        className="w-64 max-w-sm"
        testID="sign-in-button"
      >
        <Text>Sign In</Text>
      </Button>
    </View>
  );
};

export default SplashScreen;
