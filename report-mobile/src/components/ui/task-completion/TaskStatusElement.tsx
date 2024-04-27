import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'

type Props = {
    status: string,
    onPress: () => void;
}
export default function TaskStatusElement({status, onPress}: Props) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text >{status}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 4,
        borderWidth:1,
        padding: 4,
        alignItems: 'center',
        minWidth: 40
    }
})