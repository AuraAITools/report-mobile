import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { LineChart } from "react-native-gifted-charts";

type Props = {
    data: dataItem[]
}

type dataItem = {
    value: number,
    label: string,
    focusedCustomDataPoint: Function
}
export default function GraphView({ data }: Props) {
    return (
        <View>
            <LineChart data={data} isAnimated focusEnabled />
        </View>
    )
}