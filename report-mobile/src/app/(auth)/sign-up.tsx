// src/screens/SignUpScreen.tsx
import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from "react-native"
import { Link } from "expo-router"
import Spacer from "@/components/ui/Spacer"
import Icon from "react-native-vector-icons/MaterialIcons"
import PasswordInput from "@/components/ui/inputs/PasswordInput"
import GenericInput from "@/components/ui/inputs/GenericInput"

const SignUpScreen: React.FC = () => {
  const [email, setEmail] = useState("")
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [getDailyReports, setGetDailyReports] = useState(false)
  const [getweeklySummary, setGetWeeklySummary] = useState(true)

  const toggleIsPasswordShown = () => {
    setIsPasswordShown(!isPasswordShown)
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{"✦"}</Text>
      </View>
      <Text style={styles.title}>Sign up</Text>
      <GenericInput
        title='Email'
        placeholder='example@gmail.com'
        keyboardType={"email-address"}
      />
      <Spacer height={8} />
      <PasswordInput
        title='Create a password'
        placeholder='must be 8 characters'
      />
      <Spacer height={8} />
      <PasswordInput title='Confirm password' placeholder='repeat password' />
      <View style={styles.switchContainer}>
        <Text>Daily reports</Text>
        <Switch value={getDailyReports} onValueChange={setGetDailyReports} />
      </View>
      <Text style={styles.switchText}>
        Get a daily activity report via email.
      </Text>
      <View style={styles.switchContainer}>
        <Text>Weekly summary</Text>
        <Switch value={getweeklySummary} onValueChange={setGetWeeklySummary} />
      </View>
      <Text style={styles.switchText}>
        Get a weekly activity report via email.
      </Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>
        Already have an account?{" "}
        <Link href='/login' style={styles.loginLink}>
          Log in
        </Link>
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 24,
    color: "#000",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  icon: {
    fontSize: 32,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 14,
    borderColor: "#ccc",
    borderWidth: 1,
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
  passwordInput: {
    flex: 1,
    color: "#fff",
    paddingVertical: 10,
    paddingRight: 10,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  switchText: {
    fontSize: 12,
    color: "gray",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  footerText: {
    textAlign: "center",
    color: "gray",
  },
  loginLink: {
    color: "#000",
    fontWeight: "bold",
  },
})

export default SignUpScreen
