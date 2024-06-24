import React from "react"
import { View, Text, StyleSheet, Button } from "react-native"
import { useRouter } from "expo-router"
import LinkButton from "@/components/ui/LinkButton"
import {
  buttonVerticalPadding,
  constmaxWidth,
  minWidth,
} from "@/constants/ScreenDimension"

const SplashScreen: React.FC = () => {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Better Learning Begins Here</Text>
      <Text style={styles.subtitle}>Start using Aura Learning</Text>
      <View>
        <LinkButton
          href='/sign-in'
          label='Sign In'
          buttonStyle={styles.signInButton}
          textStyle={styles.signInButtonText}
        />
        <View style={styles.spacer} />
        <LinkButton
          href='/sign-up'
          label='Continue Registration'
          buttonStyle={styles.signUpButton}
          textStyle={styles.signUpButtonText}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginBottom: 24,
  },
  signInButton: {
    minWidth: minWidth,
    maxWidth: constmaxWidth,
    backgroundColor: "#000000",
    paddingVertical: 13,
    borderRadius: 8,
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  spacer: {
    height: 16,
  },
  signUpButton: {
    minWidth: minWidth,
    maxWidth: constmaxWidth,
    backgroundColor: "#fff",
    borderColor: "#000",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  signUpButtonText: {
    color: "#000",
  },
})

export default SplashScreen
