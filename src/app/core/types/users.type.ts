export type UserSimpleDetail = {
    email: string,
    first_name: string,
    last_name: string,
    education: Education,
    institution: Institution
}

export type UserDetail = {
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    education: Education,
    institution: Institution
    commune: any,
    created_at: string | Date,
    updated_at: string | Date,
    total_likes: number,
    total_downloads: number,
    total_posts: number
}

export type Education = {
    id: number,
    name: string
}

export type Institution = {
    id: number,
    name: string,
    institution_type: number // TODO: Get institution type info
}
