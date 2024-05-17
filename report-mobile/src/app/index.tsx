import { View, Text, useWindowDimensions, StyleSheet, ScrollView, Alert, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { PropsWithChildren, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@constants/Colors';
import { AntDesign } from '@expo/vector-icons';
import CardList from '@/components/ui/CardList';
import { User } from '@/types/models/User';
import { supabase } from '@/lib/supabase';
import { Button } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { Href, Redirect } from 'expo-router';


export default function AuthenticationScreen() {
  const { width, height } = useWindowDimensions();
  const { session, loading: authLoading } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<Boolean>(false);

  if (authLoading) {
    return <ActivityIndicator/>
  }

  // //TODO: if token is expired, we need to redirect too or get refresh token
  if (session) {
    return <Redirect href={`/parents` as Href<String>}  />
  }



  const dynStyles = {
    scrollView: {
      padding: width * 0.05,
      gap: height * 0.02
    },
    authProviders: {
      width: width * 0.9,
    }
  }

  function existingUsersView(accountsData: User[]) {
    return <View style={styles.userContainer}>
      <CardList data={convertAccountsDataToCardsData(accountsData)} />
    </View>
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  function Divider({ children }: PropsWithChildren) {
    return (<View style={styles.divider}>
      <View style={styles.line} />
      {children}
      <View style={styles.line} />
    </View>)
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* {existingUsersView(usersData)} */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="jon@gmail.com"
        style={styles.input}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder=""
        style={styles.input}
        secureTextEntry
      />

      <Button
        onPress={signUpWithEmail}
        // disabled={loading}
        title={loading ? 'Creating account...' : 'Create account'}
      />
      <Button title='Sign in' onPress={signInWithEmail} />

      <View style={styles.authProvidersContainer}>
        <Divider>
          <Text style={styles.text}>Sign in with</Text>
        </Divider>
        <View style={[styles.authProviders, dynStyles.authProviders]}>
          <AntDesign name="facebook-square" size={50} color="black" />
        </View>
      </View>

    </SafeAreaView>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    gap: 8,
    padding: 8
  },
  text: {
    fontSize: 16,
    alignSelf: "center"
  },
  authProvidersContainer: {
    marginTop: "auto",
    paddingVertical: 8,
    gap: 8
  },
  authProviders: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  divider: {
    flexDirection: "row",
    alignItems: 'center',
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "grey",
    marginHorizontal: 8
  },
  userContainer: {
    flex: 1
  },
  label: {
    color: 'gray',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  textButton: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginVertical: 10,
  },
})

function convertAccountsDataToCardsData(accountsData: User[]) {
  return accountsData.map(a => {
    return {
      title: a.name,
      link: `/(authenticated)/accounts/${a.id}`
    }
  })
}