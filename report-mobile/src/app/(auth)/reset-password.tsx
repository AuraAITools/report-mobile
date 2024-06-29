import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { useRouter } from "expo-router"
import PasswordInput from "@/components/ui/inputs/PasswordInput"
import GenericInput from "@/components/ui/inputs/GenericInput"

const ResetPasswordScreen: React.FC = () => {
  const [pin, setPin] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const router = useRouter()

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.")
      return
    }

    try {
      const status = 200
      if (status === 200) {
        Alert.alert("Success", "Password reset successfully!", [
          { text: "OK", onPress: () => router.push("/splash") },
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
    <View style={styles.container}>
      <Text style={styles.header}>Reset your password</Text>
      <Text style={styles.instructions}>
        An email containing the reset pin has been sent to your registered email
        address.
      </Text>
      <GenericInput
        onValueChange={setPin}
        value={pin}
        placeholder='Enter password reset pin'
        showTitle={false}
        keyboardType='numeric'
        containerStyle={styles.input}
      />
      <PasswordInput
        onValueChange={setNewPassword}
        value={newPassword}
        placeholder='Enter a new password'
        showTitle={false}
        containerStyle={styles.input}
      />
      <PasswordInput
        onValueChange={setConfirmPassword}
        value={confirmPassword}
        placeholder='Re-enter the new password'
        showTitle={false}
        containerStyle={styles.input}
      />
      <TouchableOpacity onPress={handlePasswordReset} style={styles.button}>
        <Text style={styles.buttonText}>Reset password</Text>
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
    marginBottom: 20,
    textAlign: "left",
    fontWeight: "bold",
  },
  instructions: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "left",
    color: "#000",
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 10,
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

export default ResetPasswordScreen
