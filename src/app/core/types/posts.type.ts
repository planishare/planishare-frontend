import { OrderingType } from "../enums/posts.enum";
import { Pageable } from "./pageable.type";
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
    downloads: number,
    is_liked: number | null // Contains like id if is liked by auth user
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

// Post query params: structure in frontend
export type PostsQueryParams = {
    page?: number,
    search?: string,
    userId?: number,
    academicLevel?: number,
    subject?: number,
    axis?: number,
    ordering?: OrderingType
}

// Post query params: structure in backend
export type RealPostsQueryParams = {
    page?: number,
    search?: string | '',
    user__id?: number | '',
    academic_level__id?: number | '',
    axis__subject__id?: number | '',
    axis__id?: number | '',
    ordering?: OrderingType | ''
}

export type PostPageable = Pageable & {
    results: PostDetail[]
}
