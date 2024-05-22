import React from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native"
import { Href, Link, useLocalSearchParams } from "expo-router"


export default function ManageInstitutionScreen() {
  const {institution_id} = useLocalSearchParams();
  const buttonsMapping = [
    { href: `timeline`, label: "Manage Timelines" },
    { href: `invoices`, label: "Manage invoices" },
    { href: `classes`, label: "Manage Classes" },
    { href: `testgroup`, label: "Manage Test Group" },
    { href: `educators`, label: "Manage Educators" },
    { href: `parents`, label: "Manage Parents" },
    { href: `students`, label: "Manage Students" },
    { href: `topics`, label: "Manage Topics" },
    { href: `material`, label: "Manage Materials" },
    { href: `dashboard`, label: "Admin Dashboard" },
  ]

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  button: {
    backgroundColor: "white",
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  link: {
    margin: 10,
    padding: 10,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  }
})
