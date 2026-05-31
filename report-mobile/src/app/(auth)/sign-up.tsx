import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { Link } from "expo-router";
import Spacer from "@/components/ui/Spacer";
import PasswordInput from "@/components/ui/inputs/PasswordInput";
import GenericInput from "@/components/ui/inputs/GenericInput";
import CustomSwitch from "@/components/ui/CustomSwitch";
import LinkButton from "@/components/ui/LinkButton";
import { minWidth, constmaxWidth } from "@/constants/ScreenDimension";

const SignUpScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [getDailyReports, setGetDailyReports] = useState(false);
  const [getweeklySummary, setGetWeeklySummary] = useState(false);

  return (
    <View style={styles.container} testID="sign-up-screen">
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{"✦"}</Text>
      </View>
      <Text style={styles.title}>Sign up</Text>
      <GenericInput
        title="Email"
        placeholder="example@gmail.com"
        keyboardType={"email-address"}
        onValueChange={setEmail}
        value={email}
        testID="email-input"
      />
      <Spacer height={8} />
      <PasswordInput
        title="Create a password"
        placeholder="must be 8 characters"
        onValueChange={setPassword}
        value={password}
        testID="password-input"
      />
      <Spacer height={8} />
      <PasswordInput
        title="Confirm password"
        placeholder="repeat password"
        onValueChange={setConfirmPassword}
        value={confirmPassword}
        testID="confirm-password-input"
      />
      <View style={styles.switchContainer}>
        <CustomSwitch
          value={getDailyReports}
          onValueChange={setGetDailyReports}
        />
        <View style={styles.switchTextContainer}>
          <Text style={styles.switchTitle}>Daily reports</Text>
          <Text style={styles.switchText}>
            Get a daily activity report via email.
          </Text>
        </View>
      </View>
      <View style={styles.switchContainer}>
        <CustomSwitch
          value={getweeklySummary}
          onValueChange={setGetWeeklySummary}
        />
        <View style={styles.switchTextContainer}>
          <Text style={styles.switchTitle}>Weekly summary</Text>
          <Text style={styles.switchText}>
            Get a weekly activity report via email.
          </Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <LinkButton
          href="/login"
          label="Log in"
          buttonStyle={styles.button}
          textStyle={styles.buttonText}
          testID="submit-button"
        />
      </View>
      <Text style={styles.footerText}>
        {"Already have an account? "}
        <Link href="/login" style={styles.loginLink}>
          Log in
        </Link>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "left",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },
  switchTextContainer: {
    marginLeft: 12,
  },
  switchTitle: {
    fontWeight: "600",
    fontSize: 16,
  },
  switchText: {
    fontSize: 14,
    color: "gray",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    minWidth: minWidth,
    maxWidth: constmaxWidth,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  footerText: {
    marginTop: 24,
    textAlign: "center",
    color: "gray",
  },
  loginLink: {
    color: "#000",
    fontWeight: "bold",
  },
});

export default SignUpScreen;
