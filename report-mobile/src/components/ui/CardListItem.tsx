import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Href, Link } from 'expo-router'
import { EvilIcons } from '@expo/vector-icons'
import { Dimensions } from 'react-native'
type Props = {
    title: string,
    href: string
}

const dimensions = Dimensions.get('window');

export default function CardListItem({ title, href }: Props) {

    return (
        <Link href={href as Href<string>} style={styles.card} asChild>
            <TouchableOpacity >
                <EvilIcons name="user" size={50} color="black" />
                <View>
                    <Text>
                        {title.toUpperCase()}
                    </Text>
                </View>
            </TouchableOpacity>
        </Link>
    )
}

const styles = StyleSheet.create({
    card: {
        minWidth: dimensions.width * 0.8,
        maxWidth: dimensions.width * 0.85,
        minHeight: 60,
        maxHeight: 80,
        flexDirection: "row",
        gap: 4,
        alignItems: "center",
        marginTop: 4,
        marginBottom: 4,
        backgroundColor: "#cccccc",
        borderWidth: 4,
        borderRadius: 4,
        borderColor: "#cccccc"
    }
})