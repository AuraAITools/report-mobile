import React from 'react'
import { FlatList, FlatListComponent, StyleSheet, Text, View } from 'react-native'
import TaskItem from './TaskItem'

type Props = {
  taskItemData: TaskItemData[],
  title: string
}

type TaskItemData = {
  title: string,
  status: string
}
export default function TaskItemsListContainer(props: Props) {

  function Separator() {
    return (<View style={styles.separator} />)
  }

  return (
    <View>
      <Text>{props.title}</Text>
      <FlatList
        style={styles.container}
        data={props.taskItemData}
        renderItem={({ item }) => <TaskItem title={item.title} status={item.status.toUpperCase()} onPress={() => console.log(`clicked container ${item.title}`)} />}
        ItemSeparatorComponent={() => <Separator />}
        numColumns={1}
      />
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
  },
  separator: {
    height: 4
  }
})
