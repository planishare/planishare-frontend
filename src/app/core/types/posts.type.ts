import { OrderingType } from "../enums/posts.enum";
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

// Just an object
export type PostsQueryParams = {
    page?: number,
    search?: string,
    userId?: number,
    academicLevel?: AcademicLevel,
    subject?: Subject,
    axis?: Axis,
    ordering?: OrderingType
}

// Query params used in request
export type RealPostsQueryParams = {
    page?: number,
    search?: string | '',
    user__id?: number | '',
    academic_level__id?: number | '',
    axis__subject__id?: number | '',
    axis__id?: number | '',
    ordering?: OrderingType | ''
}
