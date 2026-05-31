import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native"
import GenericInput from "@/components/ui/inputs/GenericInput"
import { useRouter } from "expo-router"

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState("")
  const router = useRouter()

  const handlePasswordReset = async () => {
    try {
      const status = 200
      if (status === 200) {
        Alert.alert("Success", "Password reset successfully!", [
          { text: "OK", onPress: () => router.push("/reset-password") },
        ])
      } else {
        Alert.alert("Error", "Failed to reset password. Please try again.")
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again.")
      console.error(error)
    }
  }

  return (
    <View style={styles.container} testID="forgot-password-screen">
      <Text style={styles.header}>Reset your password</Text>
      <GenericInput
        onValueChange={setEmail}
        value={email}
        placeholder='Enter your registered email address'
        showTitle={false}
        keyboardType='email-address'
        containerStyle={styles.input}
        testID="email-input"
      />
      <TouchableOpacity onPress={handlePasswordReset} style={styles.button} testID="reset-password-button">
        <Text style={styles.buttonText}>Send password reset link</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 30,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
})

export default ForgotPasswordScreen
