import React, { useState } from "react";
import { View } from "react-native";
import { Link } from "expo-router";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";

const SignInScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registrationCode, setRegistrationCode] = useState("");
  const auth = useAuth();

  const handleLogin = async () => {
    try {
      await auth.loginUser();
    } catch (error) {
      console.error(`problem logging in`);
    } finally {
      setEmail("");
      setPassword("");
    }
  };

  return (
    <View className="flex-1 bg-background px-6 py-4" testID="sign-in-screen">
      <Text variant="h2" className="mb-4 w-4/5 shrink">
        Better learning begins here.
      </Text>
      <View className="mb-6 h-36 rounded-lg bg-muted" />
      <Text variant="large" className="mb-4 text-center">
        Login to your Aura Learning account
      </Text>
      <Input
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your registered email"
        autoCapitalize="none"
        keyboardType="email-address"
        className="mb-4"
        testID="email-input"
      />
      <PasswordInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        containerClassName="mb-4"
        testID="password-input"
      />
      <Input
        value={registrationCode}
        onChangeText={setRegistrationCode}
        placeholder="(Optional) Registration code"
        autoCapitalize="none"
        className="mb-4"
      />
      <Button onPress={handleLogin} className="mt-1" testID="sign-in-button">
        <Text>Login</Text>
      </Button>

      <View className="mt-5 items-center">
        <View className="mb-2.5 w-[90%] flex-row items-center">
          <Separator className="flex-1" />
          <Text className="mx-2 text-sm text-muted-foreground">
            Having problems logging in?
          </Text>
          <Separator className="flex-1" />
        </View>
        <View className="flex-row items-center justify-evenly">
          <Link href="/forgot-password" asChild>
            <Button variant="link" testID="forgot-password-link">
              <Text className="text-sm text-muted-foreground">
                I forgot my password
              </Text>
            </Button>
          </Link>
          <Separator orientation="vertical" className="h-8" />
          <Link href="/other-problem" asChild>
            <Button variant="link">
              <Text className="text-sm text-muted-foreground">
                Other problems
              </Text>
            </Button>
          </Link>
        </View>
      </View>
    </View>
  );
};

export default SignInScreen;
