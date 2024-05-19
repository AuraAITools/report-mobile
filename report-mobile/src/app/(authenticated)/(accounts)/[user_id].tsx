import { View,Text } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import { accountsData } from '@assets/data/Accounts';
import CardList from '@/components/ui/CardList';
import { Account } from '@/types/models/Account';

export default function AccountsScreen() {
  const { user_id } = useLocalSearchParams();
  return (
    <View>
      <Stack.Screen options={{title: "Accounts" ,headerTitleAlign: 'center'}}/>
      <Text> Welcome user: {user_id}</Text>
      <CardList data={convertAccountsDataToCardData(accountsData)} />
    </View>
  )
}

function convertAccountsDataToCardData(accountsData: Account[]) {
  return accountsData.map(a => {
    return {
      title: a.type,
      link: `/(authenticated)/(${a.type}s)/${a.id}`
    }
  })
}