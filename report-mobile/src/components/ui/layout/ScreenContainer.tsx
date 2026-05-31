import React, { PropsWithChildren } from "react";
import { ScrollView, View, StyleSheet, ViewStyle } from "react-native";
import {
  SafeAreaView,
  type Edge,
} from "react-native-safe-area-context";

type ScreenContainerProps = PropsWithChildren<{
  scrollable?: boolean;
  style?: ViewStyle;
  edges?: Edge[];
}>;

export default function ScreenContainer({
  children,
  scrollable = true,
  style,
  edges,
}: ScreenContainerProps) {
  return (
    <SafeAreaView style={[styles.safeArea, style]} edges={edges}>
      {scrollable ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={styles.staticContent}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  staticContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
