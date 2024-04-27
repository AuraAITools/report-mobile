import { View, Text } from 'react-native'
import React from 'react'
import CardList from '@/components/ui/CardList'
import { Classes } from '@assets/data/Classes'
import { Class } from '@/types/models/Class'

export default function ClassesScreen() {
    return (
        <View>
            <CardList data={convertClassesDataToCardData(Classes)} />
        </View>
    )
}

function convertClassesDataToCardData(accountsData: Class[]) {
  return accountsData.map(a => {
    return {
      title: a.name,
      link: `subjects`
    }
  })
}