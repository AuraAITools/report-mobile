import React from 'react'
import { Stack } from 'expo-router'

export default function InstitutionsLayout() {
    return (
        <Stack>
            <Stack.Screen name='[parent_id]' options={{ title: "Registered institutions" }} />
            <Stack.Screen name='classes' options={{ title: "Registered classes" }} />
        </Stack>
    )
}