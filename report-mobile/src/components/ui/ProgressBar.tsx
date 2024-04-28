import { View, Text, TouchableOpacity, StyleSheet, Dimensions, useWindowDimensions } from 'react-native'
import React from 'react'
import { BarChart } from 'react-native-gifted-charts'

type Props = {
    start: number,
    end: number, 
    title: string
}

export default function ProgressBar({start,end,title}: Props) {

    const {width,height} = useWindowDimensions();

    return (
        <View>
            <Text>{`${title} (${start}/${end})`}</Text>
            <TouchableOpacity style={[styles.progressBar, {width: width * start/end}]}/>
        </View>
    )
}

const styles = StyleSheet.create({
    progressBar: {
        backgroundColor: 'green',
        flexDirection: 'row',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.04,
        borderRadius: 4,
        marginVertical: 2
    }
})