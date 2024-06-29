import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Ionicons"

const OtherProblemScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Having problems logging in?</Text>
      <Text style={styles.text}>
        Please contact your institution to troubleshoot your login problems.
      </Text>
      <Text style={styles.text}>
        You may be required to provide verification of your enrollment or
        identity before your account can be reset.
      </Text>
      <Text style={styles.text}>
        If you require more technical assistance, please write to:{" "}
        <Text style={styles.email}>hello@auralearning.com</Text>
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
  header: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "left",
    fontWeight: "bold",
  },
  text: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: "left",
    color: "#000",
  },
  email: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
})

export default OtherProblemScreen
