import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native"
import PasswordInput from "@/components/ui/inputs/PasswordInput"
import GenericInput from "@/components/ui/inputs/GenericInput"
import Divider from "@/components/ui/Divider"
import LinkButton from "@/components/ui/LinkButton"

const SignInScreen: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [registrationCode, setRegistrationCode] = useState("")

  const handleLogin = () => {
    //TODO: handle login logic here
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Better learning begins here.</Text>
      <View style={styles.placeholder} />
      <Text style={styles.subtitle}>Login to your Aura Learning account</Text>
      <GenericInput
        value={email}
        onValueChange={setEmail}
        placeholder='Enter your registered email'
        showTitle={false}
        containerStyle={styles.input}
      />
      <PasswordInput
        onValueChange={setPassword}
        value={password}
        placeholder='Enter your password'
        showTitle={false}
        containerStyle={styles.input}
      />
      <GenericInput
        value={registrationCode}
        onValueChange={setRegistrationCode}
        placeholder='(Optional) Registration code'
        showTitle={false}
        containerStyle={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.footerContainer}>
        <View style={styles.dividerContainer}>
          <Divider isVertical={false} />
          <Text style={styles.problemText}>Having problems logging in?</Text>
          <Divider isVertical={false} />
        </View>
        <View style={styles.linksContainer}>
          <LinkButton
            href='/forgot-password'
            label='I forgot my password'
            buttonStyle={styles.linkWrapper}
            textStyle={styles.linkText}
          />
          <Divider isVertical={true} />
          <LinkButton
            href='/other-problem'
            label='Other problems'
            buttonStyle={styles.linkWrapper}
            textStyle={styles.linkText}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 16,
    width: "80%",
    flexShrink: 1,
  },
  placeholder: {
    height: 150,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  footerContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    marginBottom: 10,
  },
  problemText: {
    marginHorizontal: 8,
    fontSize: 14,
    color: "gray",
  },
  linksContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  linkWrapper: {
    alignItems: "center",
    flex: 1,
  },
  linkText: {
    fontSize: 14,
    color: "gray",
  },
})

export default SignInScreen
