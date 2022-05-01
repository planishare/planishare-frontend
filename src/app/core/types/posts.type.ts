import { UserSimpleDetail } from "./users.type";

export type PostDetail = {
    id: number,
    user: UserSimpleDetail,
    title: string,
    description: string,
    image: string,
    academic_level: {
        id: number,
        name: string
    },
    axis: {
        id: number,
        name: string,
        subject: {
            id: number,
            name: string
        }
    },
    main_file: string,
    suporting_material: string,
    created_at: string | Date,
    updated_at: string | Date,
    likes: number,
    downloads: number
}

// Academic Level, Subjects and Axis
export type AcademicLevel = {
    id: number,
    name: string
}

export type Subject = {
    id: number,
    name: string
}

export type Axis = {
    id: number,
    name: string,
    subject: Subject
}
