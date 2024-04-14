import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { accountsData } from '@assets/data/Accounts';
import CardList from '@/components/ui/CardList';
import { Account } from '@/types/models/Account';

export default function AccountsScreen() {
  const {user_id} = useLocalSearchParams();

  return (
    <View>
      <CardList data={convertAccountsDataToCardData(accountsData)} />
    </View>
  )
}

function convertAccountsDataToCardData(accountsData: Account[]) {
  return accountsData.map(a => {
    return {
      title: a.type,
      link: `(${a.type})/${a.id}`
    }
  })
}