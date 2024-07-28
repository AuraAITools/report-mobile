import React, { useEffect } from 'react'
import { Redirect, Stack, useRouter } from 'expo-router'
import Dropdown from '@/components/ui/Dropdown'
import { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { useAuth } from '@/providers/AuthProvider'
import { Button, View } from 'react-native'

const AuthenticatedLayout = () => {
  const { session, loading } = useAuth();
  const router = useRouter();

  // if user is authenticated redirect to accounts screen
  useEffect(() => {
    if (!loading && session) {
      // router.replace(`(accounts)/${session.user.id}` as Href<string>)
    }
  }, [session, loading])

  async function signOut() {
    console.log('signing out')
    // const { error } = await supabase.auth.signOut();
    // if (error) {
      //TODO: include a error toast in the future
      // console.log(error.message);
    // }
  }

  const headerOptions = (
    title: string,
    showRightHeader: boolean
  ): NativeStackNavigationOptions => {
    return {
      title,
      headerRight: showRightHeader
        ? (props) => (
          <View>
            <Dropdown
              items={[{ value: "test1" }, { value: "test2" }]}
            ></Dropdown>
            <Button onPress={signOut} title="sign out" />
          </View>

        )
        : undefined,
      headerTitleAlign: "center",
    }
  }


  // if not authenticated redirect to index page
  if (!session) {
    return <Redirect href="/" />
  }

  return (
    <Stack initialRouteName='(accounts)/[user_id]'>
      <Stack.Screen name='(accounts)/[user_id]' options={headerOptions("Accounts", true)} />
      <Stack.Screen name='(accounts)/create-institution' options={headerOptions("Create Institution", true)} />
      <Stack.Screen name='(accounts)/create-parent' options={headerOptions("Create Parent", true)} />
      <Stack.Screen name='(accounts)/create-educator' options={headerOptions("Create Educator", true)} />
      <Stack.Screen name='(accounts)/create-student' options={headerOptions("Create Student", true)} />
      <Stack.Screen name='(educators)' options={headerOptions("Educators", true)} />
      <Stack.Screen name='(institutions)/[institution_id]' options={headerOptions("Institutions", true)} />
      <Stack.Screen name='(parents)' options={headerOptions("Parents", true)} />
    </Stack>
  )
}

export default AuthenticatedLayout