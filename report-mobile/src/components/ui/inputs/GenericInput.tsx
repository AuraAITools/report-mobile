import {
  View,
  TextInput,
  Text,
  KeyboardTypeOptions,
  StyleSheet,
} from "react-native"
import Spacer from "../Spacer"
import { ViewStyle } from "react-native"

interface GenericInputProps {
  onValueChange: React.Dispatch<React.SetStateAction<string>>
  value: string
  showTitle?: boolean
  placeholder?: string
  title?: string
  keyboardType?: KeyboardTypeOptions
  autoCapitalise?: "none" | "sentences" | "words" | "characters" | undefined
  containerStyle?: ViewStyle
}

const GenericInput: React.FC<GenericInputProps> = ({
  title,
  placeholder,
  keyboardType,
  autoCapitalise = "none",
  onValueChange,
  value,
  showTitle = true,
  containerStyle,
}) => {
  return (
    <View style={{ ...styles.container, ...containerStyle }}>
      {showTitle ? (
        <View>
          <Text>{title}</Text>
          <Spacer height={4} />
        </View>
      ) : null}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onValueChange}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalise}
        />
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: { marginBottom: 8 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 8,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  input: {
    flex: 1,
    color: "#000",
    paddingVertical: 10,
    paddingHorizontal: 5,
    fontSize: 16,
  },
  icon: {
    marginLeft: 10,
  },
})
export default GenericInput
