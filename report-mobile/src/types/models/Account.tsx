export type Account = {
    id: string,
    name: string,
    type: AccountType
}

export type AccountType = 'institution' | 'educator' | 'parent';