import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { constmaxWidth, minWidth } from "@/constants/ScreenDimension";
import Spacer from "@/components/ui/Spacer";
import { useAuth } from "@/providers/AuthProvider";
import RegularButton from "@/components/ui/RegularButton";

const SplashScreen: React.FC = () => {
  const auth = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Better Learning Begins Here</Text>
      <Text style={styles.subtitle}>Start using Aura Learning</Text>
      <View>
        <RegularButton
          label="Sign In"
          buttonStyle={styles.signInButton}
          textStyle={styles.signInButtonText}
          onPress={auth.loginUser}
        />
        <Spacer />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 20,
    width: "80%",
    flexShrink: 1,
  },
  subtitle: {
    fontSize: 17,
    color: "#000000",
    opacity: 0.7,
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
    fontWeight: "600",
  },
});

export default SplashScreen;
