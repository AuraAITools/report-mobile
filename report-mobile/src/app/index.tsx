import { View, Text, useWindowDimensions, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@constants/Colors';
import { AntDesign } from '@expo/vector-icons';
import { accountsData } from '@assets/data/Accounts';
import CardList from '@/components/ui/CardList';
import { usersData } from '@assets/data/Users';
import { User } from '@/types/models/User';

export default function AuthenticationScreen() {
  const { width, height } = useWindowDimensions();

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

  function signInWithGoogle() {
    // authCtx.authenticate()
  }

  type DividerProps = {
    children: React.ReactNode
  }
  function Divider({ children }: DividerProps) {
    return (<View style={styles.divider}>
      <View style={styles.line} />
      {children}
      <View style={styles.line} />
    </View>)
  }

  return (
    <SafeAreaView style={styles.container}>
      {existingUsersView(usersData)}
      <Divider>
        <Text style={styles.text}>Sign in with</Text>
      </Divider>
      <View style={[styles.authProviders, dynStyles.authProviders]}>
        <AntDesign onPress={signInWithGoogle} name="google" size={50} color="black" />
        <AntDesign name="facebook-square" size={50} color="black" />
      </View>
    </SafeAreaView>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background
  },
  text: {
    fontSize: 16,
    alignSelf: "center"
  },
  authProviders: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    margin: 20
  },
  divider: {
    flexDirection: "row",
    alignItems: 'center',
    gap: 8
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "grey",
    marginHorizontal: 8
  },
  userContainer: {
    flex: 1
  }
})

function convertAccountsDataToCardsData(accountsData: User[]) {
  return accountsData.map(a => {
    return {
      title: a.name,
      link: `/(authenticated)/accounts/${a.id}`
    }
  })
}