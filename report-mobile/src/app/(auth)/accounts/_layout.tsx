import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function AccountsLayout() {
  return (
    <Stack>
      <Stack.Screen name='[user_id]' options={{ title: "Accounts" }} />
    </Stack>
  )
}