import React from 'react'
import { useAuth } from '@/providers/AuthProvider';
import { Href, Redirect } from 'expo-router';
import { ActivityIndicator } from 'react-native';


export default function Index() {
  const { session, loading: stillFetchingAuthSession } = useAuth();
  if (stillFetchingAuthSession) {
    return <ActivityIndicator />
  }
  
  if (!session) {
    return <Redirect href={`/(auth)/sign-in` as Href<String>} />
  }

  return <Redirect href={"/(authenticated)" as Href<String>} />
}

