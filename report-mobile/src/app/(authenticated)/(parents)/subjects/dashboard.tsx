import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import TaskItemsListContainer from '@/components/ui/task-completion/TaskItemsListContainer'
import GraphView from '@/components/graphs/GraphView'
const lessonData = [
  {
    title: 'lesson 1',
    status: 'done',
  },
  {
    title: 'lesson 2',
    status: 'upcoming',
  }
]


const dPoint = () => {
  return (
    <View
      style={{
        width: 14,
        height: 14,
        backgroundColor: 'white',
        borderWidth: 3,
        borderRadius: 7,
        borderColor: '#07BAD1',
      }}
    >
    </View>
  );
};

function getRandomData() {
  return [
    { value: Math.floor(Math.random() * 100), label: 'Jan', focusedCustomDataPoint: dPoint },
    { value: Math.floor(Math.random() * 100), label: 'Feb', focusedCustomDataPoint: dPoint },
    { value: Math.floor(Math.random() * 100), label: 'Mar', focusedCustomDataPoint: dPoint },
    { value: Math.floor(Math.random() * 100), label: 'Apr', focusedCustomDataPoint: dPoint },
    { value: Math.floor(Math.random() * 100), label: 'May', focusedCustomDataPoint: dPoint },
    { value: Math.floor(Math.random() * 100), label: 'Jun', focusedCustomDataPoint: dPoint },
    { value: Math.floor(Math.random() * 100), label: 'Jul', focusedCustomDataPoint: dPoint },
    { value: Math.floor(Math.random() * 100), label: 'Aug', focusedCustomDataPoint: dPoint },
    { value: Math.floor(Math.random() * 100), label: 'Sep', focusedCustomDataPoint: dPoint },
    { value: Math.floor(Math.random() * 100), label: 'Oct', focusedCustomDataPoint: dPoint },
    { value: Math.floor(Math.random() * 100), label: 'Nov', focusedCustomDataPoint: dPoint },
    { value: Math.floor(Math.random() * 100), label: 'Dec', focusedCustomDataPoint: dPoint }
  ]
}

export default function DashboardScreen() {
  const [isTestToggle, setIsTestToggle] = useState<boolean>(true);

  function toggle() {
    setIsTestToggle(prev => !prev)
  }

  return (
    <View style={styles.container}>
      <Text>Aggregated View:</Text>
      <View style={styles.toggleGroup}>
        <TouchableOpacity style={styles.button} onPress={toggle}>
          <Text>Test</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={toggle}>
          <Text>Lesson</Text>
        </TouchableOpacity>
      </View>
      {isTestToggle ?
        <GraphView data={getRandomData()} />
        :
        <GraphView data={getRandomData()} />

      }
      <TaskItemsListContainer taskItemData={lessonData} title={'lesson:'} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
    gap: 4
  },
  toggleGroup: {
    padding: 4,
    flexDirection: 'row',
    gap: 4
  },
  button: {
    padding: 4,
    borderWidth: 1,
    borderRadius: 4
  }
})