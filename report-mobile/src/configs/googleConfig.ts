import { EXPO_PUBLIC_GOOGLE_CLIENT_ID } from "@env"
export const googleConfig = {
    clientId: EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    scopes: ['https://www.googleapis.com/auth/drive.readonly']
}