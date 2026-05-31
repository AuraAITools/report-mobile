import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { GestureResponderEvent } from "react-native";

interface RegularButtonProps {
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

const RegularButton: React.FC<RegularButtonProps> = ({
  label,
  buttonStyle,
  textStyle,
  onPress,
  testID,
}) => {
  return (
    <TouchableOpacity
      style={{ ...styles.button, ...buttonStyle }}
      onPress={onPress}
      testID={testID}
    >
      <Text style={{ ...styles.buttonText, ...textStyle }}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
  },
});

export default RegularButton;
