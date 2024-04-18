import { View, Text, Image, useWindowDimensions, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import Dropdown from './Dropdown';

export default function Header() {
    const {width,height} = useWindowDimensions();
    
    return (
        <View style={styles.container}>
            {/* profile */}

            {/* dropdown */}
            <Dropdown items={[{
                value: "anan"
            },
            {
                value: "betty"
            }]}/>
            <Text>Header</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'red'
    }
})