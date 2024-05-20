import React from 'react'
import { Stack } from 'expo-router'

const ParentsLayout = () => {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name='classes'/>
      <Stack.Screen name='subjects'/>
    </Stack>
  )
}

export default ParentsLayout