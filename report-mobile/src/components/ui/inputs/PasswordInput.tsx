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
import { ViewStyle } from "react-native"

interface PasswordInputProps {
  onValueChange: React.Dispatch<React.SetStateAction<string>>
  value: string
  showTitle?: boolean
  placeholder?: string
  title?: string
  containerStyle?: ViewStyle
  testID?: string
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  title,
  placeholder,
  onValueChange,
  value,
  showTitle = true,
  containerStyle,
  testID,
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

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
          placeholder={placeholder || "placeholder"}
          value={value}
          onChangeText={onValueChange}
          secureTextEntry={!showPassword}
          autoCapitalize='none'
          testID={testID}
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
export default PasswordInput
