import { FilterGroup, FilterOption } from "src/app/shared/models/filter.model";

export type PostFilters = {
    page: number,
    search?: string,
    userId?: number,
    academicLevel?: FilterOption<number>,
    subject?: FilterOption<number>,
    axis?: FilterOption<number>,
    ordering?: FilterOption<string>
}

export type PostFiltersOptions = {
    academicLevel: FilterOption<number>[],
    subject: FilterOption<number>[],
    axis: FilterGroup<number>[],
    ordering: FilterOption<string>[]
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
        if (filters.academicLevel) {
            params.academicLevel = String(filters.academicLevel.value);
        }
        if (filters.subject) {
            params.subject = String(filters.subject.value);
        }
        if (filters.axis) {
            params.axis = String(filters.axis.value);
        }
        if (filters.ordering) {
            params.ordering = filters.ordering.value as PostOrderingType;
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
        if (filters.academicLevel) {
            params.academic_level__id = String(filters.academicLevel.value);
        }
        if (filters.subject) {
            params.axis__subject__id = String(filters.subject.value);
        }
        if (filters.axis) {
            params.axis__id = String(filters.axis.value);
        }
        if (filters.ordering) {
            params.ordering = filters.ordering.value as PostOrderingType;
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
