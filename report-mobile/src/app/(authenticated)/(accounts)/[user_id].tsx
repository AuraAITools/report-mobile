import { View, ActivityIndicator, StyleSheet, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import CardList, { CardData } from '@/components/ui/CardList';
import { Account, AccountType } from '@/types/models/Account';
import { useGetAllAccounts } from '@/api/accounts';


export default function AccountsScreen() {
  const { user_id: user_id_params } = useLocalSearchParams();
  const user_id = typeof user_id_params == "string" ? user_id_params : user_id_params[0];
  const { data, error, isLoading } = useGetAllAccounts(user_id);

  if (isLoading) {
    return <ActivityIndicator />
  }

  if (error || !data) {
    return <Text>Error {JSON.stringify(error)}</Text>
  }

  return (
    <View style={styles.container}>
      <CardList data={convertAccountsDataToCardData(data)} />
    </View>
  )
}

function convertAccountsDataToCardData(data: Account[]): CardData[] {
  const ALL_ACCOUNT_TYPES = new Set<AccountType>(['INSTITUTION', 'EDUCATOR', 'PARENT', 'STUDENT']);
  const existingUserAccounts = data.map(acc => {
    ALL_ACCOUNT_TYPES.delete(acc.account_type)

    return {
      title: acc.account_type,
      link: `/(authenticated)/(${acc.account_type.toLowerCase()}s)/${acc.id}`
    }
  });

  const unSubscribedAccounts = Array.from(ALL_ACCOUNT_TYPES).map((unsub_acc) => {
    return {
      title: `create ${unsub_acc.toLowerCase()} account`,
      link: `/(authenticated)/(accounts)/create-${unsub_acc.toLowerCase()}`
    }
  })

  return [...existingUserAccounts, ...unSubscribedAccounts];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  }
})