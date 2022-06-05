import { Commune } from "./location.type";

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
    commune: Commune,
    created_at: string | Date,
    updated_at: string | Date,
    total_likes: number,
    total_views: number,
    total_posts: number
}

export type UserForm = {
    first_name: string,
    last_name: string,
    education: number,
    institution: number,
    commune: number
}

export type Education = {
    id: number,
    name: string
}

export type Institution = {
    id: number,
    name: string,
    institution_type: InstitutionType
}

export type InstitutionType = {
    id: number,
    name: string
}
