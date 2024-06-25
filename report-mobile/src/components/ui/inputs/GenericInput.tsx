import { useState } from "react"
import {
  View,
  TextInput,
  Text,
  KeyboardTypeOptions,
  StyleSheet,
} from "react-native"
import Spacer from "../Spacer"

interface GenericInputProps {
  placeholder?: string
  title: string
  keyboardType?: KeyboardTypeOptions
  autoCapitalise?: "none" | "sentences" | "words" | "characters" | undefined
}

const GenericInput: React.FC<GenericInputProps> = ({
  title,
  placeholder,
  keyboardType,
  autoCapitalise = "none",
}) => {
  const [textValue, setTextValue] = useState("")

  return (
    <View>
      <Text>{title}</Text>
      <Spacer height={4} />
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={textValue}
          onChangeText={setTextValue}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalise}
        />
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    color: "#000",
    paddingVertical: 10,
    paddingRight: 10,
    fontSize: 16,
  },
  icon: {
    marginLeft: 10,
  },
})
export default GenericInput
