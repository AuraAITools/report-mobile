import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import TaskItemsListContainer from '@/components/ui/task-completion/TaskItemsListContainer'
const data = [
  {
    title: 'lesson 1',
    status: 'done'
  },
  {
    title: 'lesson 2',
    status: 'upcoming'
  }
]
export default function DashboardScreen() {
  
  return (
    <View style={styles.container}>
      <TaskItemsListContainer taskItemData={data} title={'lesson:'} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 4
  }
})