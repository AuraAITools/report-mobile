import { Text, View} from 'react-native'
import React from 'react'
import { institutionsData } from '@assets/data/Institutions'
import CardList from '@/components/ui/CardList'
import { Institution } from '@/types/models/Institution'
import { useAuth } from '@/providers/AuthProvider'
import Account from '@/components/ui/Account'

export default function InstitutionsScreen() {
  const {session} = useAuth();
  return (
    <View>
      <CardList data={convertInstitutionsDataToCardList(institutionsData)} />
      <View>
        {session && session.user ? <Account key={session.user.id} session={session}/>:<Text>Fail</Text>}
      </View>
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