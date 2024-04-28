import { View, Text } from 'react-native'
import React from 'react'
import { Subject } from '@/types/models/Subject'
import { Subjects } from '@assets/data/Subjects'
import CardList from '@/components/ui/CardList'

export default function SubjectScreen() {
    return (
        <View>
            <CardList data={convertSubjectsDataToCardData(Subjects)} />
        </View>
    )
}

function convertSubjectsDataToCardData(accountsData: Subject[]) {
    return accountsData.map(a => {
        return {
            title: a.name,
            link: `/(authenticated)/(parents)/subjects/dashboard`
        }
    })
}