export type UserSimpleDetail = {
    email: string,
    first_name: string,
    last_name: string,
    education: {
        id: number,
        name: string
    },
    institution: {
        id: number,
        name: string,
        institution_type: number
    }
}
