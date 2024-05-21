import { TextInput, StyleSheet, Dimensions, ActivityIndicator, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useCreateInstitution } from '@/api/accounts';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from 'react-native-elements';
import { useRouter } from 'expo-router';

const dimensions = Dimensions.get('window')
export default function CreateInstitutionScreen() {

    const [name, setName] = useState<string>('');
    const { mutate: createInstitution } = useCreateInstitution();
    const router = useRouter();

    const auth = useAuth();

    async function submitHandler() {
        createInstitution({
            name: name,
            email: auth.session?.user.email!,
            user_id: auth.session?.user.id!
        }, {
            onSuccess: () => {
                if (router.canGoBack()) {
                    router.back();
                }
            }
        })
    }

    return (
        <>
            <SafeAreaView style={styles.form}>
                <TextInput onChangeText={setName} style={styles.name} placeholder='institution name' />
            </SafeAreaView>
            <Button style={styles.button} title="Submit Form" onPress={submitHandler} />
        </>

    )
}

const styles = StyleSheet.create({
    form: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 8
    },
    button: {
        minWidth: dimensions.width * 0.8,
        maxWidth: dimensions.width * 0.85,
    },
    name: {
        borderWidth: 1,
        minWidth: dimensions.width * 0.8,
        maxWidth: dimensions.width * 0.85,
        borderRadius: 4,
        minHeight: 40,
        maxHeight: 80,
        fontStyle: 'italic',
        color: "#cccccc",
        paddingHorizontal: 8
    }
})