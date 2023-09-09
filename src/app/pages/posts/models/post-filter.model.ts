import { Filter } from "src/app/shared/models/filter.model";

export type PostFilters = {
    page: number,
    search?: string,
    userId?: number,
    academicLevel: Filter<number>,
    subject: Filter<number>,
    axis: Filter<number>,
    ordering: Filter<string>
}

export enum PostFilterName {
    ACADEMIC_LEVEL = 'Nivel',
    SUBJECT = 'Asignatura',
    AXIS = 'Eje',
    ORDERING = 'Ordenar por',
}

export enum PostOrderingType {
    LESS_LIKED = 'total_likes',
    MOST_LIKED = '-total_likes',
    LESS_VIEWED = 'total_views',
    MOST_VIEWED = '-total_views',
    LESS_RECENT = 'created_at',
    MOST_RECENT = '-created_at',
}

export enum PostOrderingName {
    'total_likes' = 'Más gustadas (Descendente)',
    '-total_likes' = 'Más gustadas',
    'total_views' = 'Más vistas (Descendente)',
    '-total_views' = 'Más vistas',
    'created_at' = 'Más antiguas',
    '-created_at' = 'Más recientes',
}

export class MapPostFilters {
    public static toURLQueryParams(filters: PostFilters): URLPostsParams {
        const params: URLPostsParams = {};
        if (filters.page) {
            params.page = String(filters.page);
        }
        if (filters.search) {
            params.search = filters.search;
        }
        if (filters.userId) {
            params.userId = String(filters.userId);
        }
        if (filters.academicLevel.currentOption) {
            params.academicLevel = String(filters.academicLevel.currentOption.value);
        }
        if (filters.subject.currentOption) {
            params.subject = String(filters.subject.currentOption.value);
        }
        if (filters.axis.currentOption) {
            params.axis = String(filters.axis.currentOption.value);
        }
        if (filters.ordering.currentOption) {
            params.ordering = filters.ordering.currentOption.value as PostOrderingType;
        }
        return params;
    }

    public static toAPIParams(filters: PostFilters): APIPostsParams {
        const params: APIPostsParams = {};
        if (filters.page) {
            params.page = String(filters.page);
        }
        if (filters.search) {
            params.search = filters.search;
        }
        if (filters.userId) {
            params.user__id = String(filters.userId);
        }
        if (filters.academicLevel.currentOption) {
            params.academic_level__id = String(filters.academicLevel.currentOption.value);
        }
        if (filters.subject.currentOption) {
            params.axis__subject__id = String(filters.subject.currentOption.value);
        }
        if (filters.axis.currentOption) {
            params.axis__id = String(filters.axis.currentOption.value);
        }
        if (filters.ordering.currentOption) {
            params.ordering = filters.ordering.currentOption.value as PostOrderingType;
        }
        return params;
    }
}

export type URLPostsParams = {
    page?: string,
    search?: string,
    userId?: string,
    academicLevel?: string,
    subject?: string,
    axis?: string,
    ordering?: PostOrderingType
}

export type APIPostsParams = {
    page?: string,
    search?: string,
    user__id?: string,
    academic_level__id?: string,
    axis__subject__id?: string,
    axis__id?: string,
    ordering?: PostOrderingType | ''
}
