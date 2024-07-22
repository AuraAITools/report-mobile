import React from "react"
import { View, ViewStyle } from "react-native"

interface SpacerProps {
  height?: number
  width?: number
}

const Spacer: React.FC<SpacerProps> = ({ height = 16, width = 0 }) => {
  const spacerStyle: ViewStyle = {
    height,
    width,
  }

  return <View style={spacerStyle} />
}

export default Spacer
