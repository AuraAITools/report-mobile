import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { SlideInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

export default function OfflineBanner() {
  return (
    <Animated.View entering={SlideInUp.duration(400)} style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={18} color="#92400E" />
      <Text style={styles.text}>
        You're offline — showing cached data
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#FDE68A",
  },
  text: {
    fontSize: 13,
    fontWeight: "500",
    color: "#92400E",
    flexShrink: 1,
  },
});
