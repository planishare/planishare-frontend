export type BasicCredentials = {
    email: string,
    password: string
}

export type RegisterInfo = {
    id?: number,
    email: string,
    first_name: string | null,
    last_name: string | null
}
