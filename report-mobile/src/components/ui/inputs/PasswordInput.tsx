import { useState } from "react"
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native"
import { Icon } from "react-native-elements"
import Spacer from "../Spacer"

interface PasswordInputProps {
  placeholder?: string
  title: string
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  title,
  placeholder,
}) => {
  const [password, setPassword] = useState("")

  const [showPassword, setShowPassword] = useState(false)

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <View>
      <Text>{title}</Text>
      <Spacer height={4} />
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder={placeholder || "placeholder"}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize='none'
        ></TextInput>
        <TouchableOpacity onPress={toggleShowPassword}>
          <Icon
            name={showPassword ? "visibility" : "visibility-off"}
            size={24}
            color='gray'
            style={styles.icon}
          />
        </TouchableOpacity>
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
export default PasswordInput
