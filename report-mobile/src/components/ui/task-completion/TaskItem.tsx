import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import TaskStatusElement from './TaskStatusElement'

type Props = {
    title: string,
    status: string,
    onPress: ()  => void;
}

export default function TaskItem({title, status, onPress}: Props) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
        <Text>{title}</Text>
        <View style={styles.divider}/>
        <TaskStatusElement status={status} onPress={() => {console.log('clicked status')}}/>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
        borderWidth: 1,
        borderRadius: 4
    },
    divider: {
        flex: 1
    }
})
