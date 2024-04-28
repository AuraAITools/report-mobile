import React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Href, Link, useLocalSearchParams } from "expo-router"

export default function ManageInstitutionScreen() {
  const buttonsMapping = [
    { href: `invoices`, label: "Manage invoices" },
    { href: `classes`, label: "Manage Classes" },
    { href: `educators`, label: "Manage Educators" },
    { href: `parents`, label: "Manage Parents" },
    { href: `students`, label: "Manage Students" },
  ]
  return (
    <View style={styles.container}>
      <Text style={styles.idText}>Current ID: </Text>
      {buttonsMapping.map(({ href, label }) => (
        <Link
          key={href}
          href={href as Href<string>}
          style={styles.link}
          asChild
        >
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>{label}</Text>
          </TouchableOpacity>
        </Link>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  idText: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    width: "55%",
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  link: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
  },
})
