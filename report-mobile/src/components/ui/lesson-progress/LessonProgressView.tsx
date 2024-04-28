import { View, Text, FlatList } from 'react-native'
import React from 'react'
import ProgressBar from '../ProgressBar';

type Props = {
  data: BarData[]
};

type BarData = {
  title: string,
  start: number,
  end: number
}

export default function LessonProgressView(props: Props) {
  return (
    <View>
      <FlatList
        numColumns={1}
        data={props.data}
        renderItem={(datum) => <ProgressBar start={datum.item.start} end={datum.item.end} title={datum.item.title} />}
      />
    </View>
  )
}