export type Account = {
    id: string,
    name: string,
    email: string,
    user_id: string
    account_type: AccountType
}

export type AccountType = 'INSTITUTION' | 'EDUCATOR' | 'PARENT'| 'STUDENT';