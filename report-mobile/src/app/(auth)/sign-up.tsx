import React, { useState } from "react";
import { View } from "react-native";
import { Link } from "expo-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";

const SignUpScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [getDailyReports, setGetDailyReports] = useState(false);
  const [getWeeklySummary, setGetWeeklySummary] = useState(false);

  return (
    <View className="flex-1 gap-2 bg-background p-4" testID="sign-up-screen">
      <View className="mb-4 items-center">
        <Text className="text-3xl">{"✦"}</Text>
      </View>
      <Text variant="h2" className="mb-6">
        Sign up
      </Text>

      <View>
        <Label nativeID="email">Email</Label>
        <Input
          aria-labelledby="email"
          placeholder="example@gmail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          testID="email-input"
        />
      </View>

      <View>
        <Label nativeID="password">Create a password</Label>
        <PasswordInput
          aria-labelledby="password"
          placeholder="must be 8 characters"
          value={password}
          onChangeText={setPassword}
          testID="password-input"
        />
      </View>

      <View>
        <Label nativeID="confirm-password">Confirm password</Label>
        <PasswordInput
          aria-labelledby="confirm-password"
          placeholder="repeat password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          testID="confirm-password-input"
        />
      </View>

      <View className="mt-4 flex-row items-center gap-3">
        <Switch checked={getDailyReports} onCheckedChange={setGetDailyReports} />
        <View>
          <Text className="font-semibold">Daily reports</Text>
          <Text className="text-sm text-muted-foreground">
            Get a daily activity report via email.
          </Text>
        </View>
      </View>

      <View className="mt-2 flex-row items-center gap-3">
        <Switch
          checked={getWeeklySummary}
          onCheckedChange={setGetWeeklySummary}
        />
        <View>
          <Text className="font-semibold">Weekly summary</Text>
          <Text className="text-sm text-muted-foreground">
            Get a weekly activity report via email.
          </Text>
        </View>
      </View>

      <View className="mt-8 items-center">
        <Link href="/(auth)/sign-in" asChild>
          <Button className="w-64 max-w-sm" testID="submit-button">
            <Text>Log in</Text>
          </Button>
        </Link>
      </View>

      <Text className="mt-6 text-center text-muted-foreground">
        Already have an account?{" "}
        <Link href="/(auth)/sign-in" className="font-bold text-foreground">
          Log in
        </Link>
      </Text>
    </View>
  );
};

export default SignUpScreen;
