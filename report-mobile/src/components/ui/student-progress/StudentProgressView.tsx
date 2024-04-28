import { View, Text } from 'react-native'
import React from 'react'

type Props = {
    studentLevel: string,
    improvementRate: string
}

export default function StudentProgressView(props: Props) {
  return (
    <View>
      <Text>Current student level: {props.studentLevel}</Text>
      <Text>improvement rate: {props.improvementRate}</Text>
    </View>
  )
}