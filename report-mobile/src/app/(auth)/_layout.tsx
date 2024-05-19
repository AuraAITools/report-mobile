import React from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
    const { session } = useAuth();

    // if user manually accesses these endpoints, bring them back to home
    // to be redirected to the accounts screen
    if (session) {
        <Redirect href="/" />
    }

    return <Stack />
}