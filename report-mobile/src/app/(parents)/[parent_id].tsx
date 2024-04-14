import { View, Text } from 'react-native'
import React from 'react'
import { institutionsData } from '@assets/data/Institutions'
import CardList from '@/components/ui/CardList'
import { Institution } from '@/types/models/Institution'

export default function InstitutionsScreen() {
  return (
    <View>
      <CardList data={convertInstitutionsDataToCardList(institutionsData)} />
    </View>
  )
}

function convertInstitutionsDataToCardList(institutionData: Institution[]) {
  return institutionData.map(i => {
    return {
      title: i.name,
      link: `classes`
    }
  })
}