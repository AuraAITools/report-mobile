import { View, StyleSheet, ViewStyle } from "react-native"

interface DividerProps {
  dividerStyle?: ViewStyle
  isVertical: boolean
}

const Divider: React.FC<DividerProps> = ({ dividerStyle, isVertical }) => {
  const selectedStyle = isVertical
    ? styles.verticalDivider
    : styles.horizontalDivider

  return <View style={{ ...selectedStyle, ...dividerStyle }} />
}

const styles = StyleSheet.create({
  horizontalDivider: {
    flex: 1,
    height: 1,
    backgroundColor: "lightgray",
  },
  verticalDivider: {
    width: 1,
    height: 50,
    backgroundColor: "lightgray",
    marginHorizontal: 12,
    borderStyle: "dashed",
    borderWidth: 0.7,
    borderRadius: 10,
  },
})

export default Divider
