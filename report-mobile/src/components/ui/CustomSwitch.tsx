import React, { useEffect, useState } from "react"
import {
  Pressable,
  View,
  Animated,
  SafeAreaView,
  StyleSheet,
} from "react-native"

interface CustomSwitchProps {
  value: boolean
  onValueChange: React.Dispatch<React.SetStateAction<boolean>>
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({
  value,
  onValueChange,
}) => {
  const [animatedValue] = useState(new Animated.Value(value ? 1 : 0))

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [value])

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [3, 20],
  })

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["#000000", "#DDDDDD"],
  })

  const toggleSwitch = () => {
    const newValue = !value
    onValueChange(newValue)
  }

  return (
    <Pressable onPress={toggleSwitch} style={styles.pressable}>
      <Animated.View style={[styles.background, { backgroundColor }]}>
        <View style={styles.innerContainer}>
          <Animated.View
            style={{
              transform: [{ translateX }],
            }}
          >
            <View style={styles.head} />
          </Animated.View>
        </View>
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  pressable: {
    marginBottom: 4,
    width: 44,
    height: 26,
    borderRadius: 16,
  },
  background: {
    borderRadius: 16,
    flex: 1,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    position: "relative",
  },
  head: {
    width: 20,
    height: 20,
    borderRadius: 100,
    backgroundColor: "#FFFFFF",
  },
})

export default CustomSwitch
