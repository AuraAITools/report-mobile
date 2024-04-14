import { View, Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { EvilIcons } from '@expo/vector-icons'
type Props = {
    title: string,
    href: string
}
export default function CardListItem({ title, href }: Props) {
    return (
        <Link href={href} style={styles.card} asChild>
            <Pressable >
                <EvilIcons name="user" size={50} color="black" />
                <View>
                    <Text>
                        {title.toUpperCase()}
                    </Text>
                </View>
            </Pressable>
        </Link>
    )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        gap: 5,
        alignItems: "center",
        marginTop: 5,
        marginBottom: 5,
        backgroundColor: "#cccccc",
        borderWidth: 5,
        borderRadius: 5,
        borderColor: "#cccccc"
    }
})