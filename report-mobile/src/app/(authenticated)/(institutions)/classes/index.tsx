import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"

export default function SchoolClassScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.classContainer}>
        <View style={styles.classItem}>
          <View style={styles.classTextContainer}>
            <Text style={styles.classText}>4G</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.classItem}>
          <View style={styles.classTextContainer}>
            <Text style={styles.classText}>5G</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addClassButton}>
          <Text style={styles.addClassText}>Add class</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    paddingTop: 50,
  },
  classContainer: {
    width: "80%",
    alignItems: "center",
  },
  classItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#444",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    width: "100%",
  },
  classTextContainer: {
    flex: 1,
    alignItems: "center",
  },
  classText: {
    color: "#fff",
    fontSize: 16,
  },
  editButton: {
    backgroundColor: "#777",
    padding: 5,
    borderRadius: 5,
  },
  editText: {
    color: "#fff",
    fontSize: 14,
  },
  addClassButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#999",
    borderRadius: 5,
    padding: 10,
    width: "100%",
  },
  addClassText: {
    color: "#fff",
    fontSize: 16,
  },
})
