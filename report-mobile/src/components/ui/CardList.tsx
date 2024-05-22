import { View, Text, FlatList, Pressable, Button, FlatListProps, StyleSheet } from 'react-native'
import React from 'react'
import CardListItem from './CardListItem'

interface Props {
    data: CardData[]
}

export interface CardData {
    title: string,
    link: string
}

export default function CardList({ data }: Props) {
    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={({ item }) => {
                    return <CardListItem title={item.title} href={item.link}/>
                }} 
                numColumns={1}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    }
})