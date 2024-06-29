import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Ionicons"
import GenericInput from "@/components/ui/inputs/GenericInput"

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState("")

  const handlePasswordReset = () => {
    //TODO: Handle password reset logic here
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reset your password</Text>
      <GenericInput
        onValueChange={setEmail}
        value={email}
        placeholder='Enter your registered email address'
        showTitle={false}
        keyboardType='email-address'
        containerStyle={styles.input}
      />
      <TouchableOpacity onPress={handlePasswordReset} style={styles.button}>
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
