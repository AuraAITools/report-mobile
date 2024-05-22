import { Account } from '@/types/models/Account';
import { apiServiceConfig } from '@/configs/apiServiceConfig';
import { Institution } from '@/types/models/Institution';
import { Educator } from '@/types/models/Educator';
import { Parent } from '@/types/models/Parent';
import { Student } from '@/types/models/Student';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import axios from 'axios';

axios.defaults.baseURL = `${apiServiceConfig.url}/api/v1`;


// useQuery caches the response data from the request
export function useGetAllAccounts(userId: string) {

    async function fetchAllAccounts() {
        console.log("fetch accounts")
        let response;
        try {
            response = await axios.get<Account[]>(`/users/${userId}/accounts`);
        } catch (error) {
            throw new Error("could not fetch accounts")
        }
        return response.data;
    }

    return useQuery({
        queryKey: ['accounts'],
        queryFn: fetchAllAccounts
    })

}

export function useCreateInstitution() {
    const queryClient = useQueryClient()

    return useMutation({
        async mutationFn(data: Institution) {
            let response;
            try {
                response = await axios.post<Institution>('/onboard/institutions', {
                    user_id: data.user_id,
                    name: data.name,
                    email: data.email
                })
            } catch (error) {
                console.log(JSON.stringify(error))
                throw new Error("could not create institution")
            }

            return response.data;
        },
        // clear cache on accounts key and refetch those queries
        async onSuccess() {
            await queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
        onError(error) {
            Alert.alert("could not create institutions")
            // TODO: throw a toast box here
        }
    })

}

export function useCreateEducator() {
    const queryClient = useQueryClient()

    return useMutation({
        async mutationFn(data: Educator) {
            let response;
            try {
                response = await axios.post<Educator>('/onboard/educators', {
                    user_id: data.user_id,
                    name: data.name,
                    email: data.email
                })
            } catch (error) {
                console.log(JSON.stringify(error))
                throw new Error("could not create educator")
            }

            return response.data;
        },
        // clear cache on accounts key and refetch those queries
        async onSuccess() {
            await queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
        onError(error) {
            Alert.alert("could not create educators")
            // TODO: throw a toast box here
        }
    })

}

export function useCreateParent() {

    const queryClient = useQueryClient()

    return useMutation({
        async mutationFn(data: Parent) {
            let response;
            try {
                response = await axios.post<Parent>('/onboard/parents', {
                    user_id: data.user_id,
                    name: data.name,
                    email: data.email
                })
            } catch (error) {
                console.log(JSON.stringify(error))
                throw new Error("could not create parent")
            }

            return response.data;
        },
        // clear cache on accounts key and refetch those queries
        async onSuccess() {
            await queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
        onError(error) {
            Alert.alert("could not create parents")
            // TODO: throw a toast box here
        }
    })

}

export function useCreateStudent() {

    const queryClient = useQueryClient()

    return useMutation({
        async mutationFn(data: Student) {
            let response;
            try {
                response = await axios.post<Student>('/onboard/students', {
                    user_id: data.user_id,
                    name: data.name,
                    email: data.email
                })
            } catch (error) {
                console.log(JSON.stringify(error))
                throw new Error("could not create student")
            }

            return response.data;
        },
        // clear cache on accounts key and refetch those queries
        async onSuccess() {
            await queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
        onError(error) {
            Alert.alert("could not create students")
            // TODO: throw a toast box here
        }
    })

}