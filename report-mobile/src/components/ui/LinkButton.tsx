import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native"
import { Link, Href } from "expo-router"
import { GestureResponderEvent } from "react-native"

interface LinkButtonProps {
  href: string
  label: string
  onPress?: (event: GestureResponderEvent) => void
  buttonStyle?: ViewStyle
  textStyle?: TextStyle
  linkStyle?: ViewStyle
  testID?: string
}

const LinkButton: React.FC<LinkButtonProps> = ({
  href,
  label,
  buttonStyle,
  textStyle,
  linkStyle,
  testID,
}) => {
  return (
    <Link href={href as Href<string>} style={linkStyle} asChild>
      <TouchableOpacity style={{ ...styles.button, ...buttonStyle }} testID={testID}>
        <Text style={{ ...styles.buttonText, ...textStyle }}>{label}</Text>
      </TouchableOpacity>
    </Link>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
  },
})

export default LinkButton
