import { View, Text } from 'react-native'
import React from 'react'

type Item = {
    value: string | number,
}
export default function DropDownListItem(item: Item) {
  return (
    <View>
      <Text>{item.value}</Text>
    </View>
  )
}