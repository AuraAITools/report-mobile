import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import DropDownListItem from './DropDownListItem'

type Props = {
    items: Item[]
}

type Item = {
    value: string | number,
}

export default function Dropdown({ items }: Props) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    function dropdownSelection(items: Item[]): React.ReactNode {
        return (
            <FlatList
                numColumns={1}
                data={items}
                renderItem={(item) => <DropDownListItem value={item.item.value} />}
            />
        )
    }

    function onPressHandler() {
        setIsOpen((prev) => !prev)
    }

    return (
        <Pressable onPress={onPressHandler}>
            <Text>Dropdown</Text>
            {isOpen && dropdownSelection(items)}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        
    },
    dropdown: {
        position: 'absolute'
    }
})