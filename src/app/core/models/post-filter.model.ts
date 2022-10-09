import { OrderingType, OrderingTypeName } from "../enums/posts.enum";
import { IAcademicLevel, IAxis, ISubject } from "./post.model";

export interface IPostFilters {
    page?: number,
    search?: string,
    userId?: number,
    academicLevel?: IAcademicLevel,
    subject?: ISubject,
    axis?: IAxis,
    ordering?: IOrdering
}

export class PostFilters {
    public page?: number;
    public search?: string;
    public userId?: number;
    public academicLevel?: IAcademicLevel;
    public subject?: ISubject;
    public axis?: IAxis;
    public ordering?: IOrdering;

    constructor(queryParams: IPostFilters) {
        this.page = queryParams.page;
        this.search = queryParams.search;
        this.userId = queryParams.userId;
        this.academicLevel = queryParams.academicLevel;
        this.subject = queryParams.subject;
        this.axis = queryParams.axis;
        this.ordering = queryParams.ordering;
    }

    public formatForAPI(): APIPostsQueryParams {
        return {
            page: String(this.page ?? 1),
            search: this.search ?? '',
            user__id: String(this.userId ?? ''),
            academic_level__id: String(this.academicLevel?.id ?? ''),
            axis__subject__id: String(this.subject?.id ?? ''),
            axis__id: String(this.axis?.id ?? ''),
            ordering: this.ordering?.id ?? ''
        };
    }

    public formatForQueryParams(): PostsQueryParams {
        return {
            search: this.search,
            academicLevel: this.academicLevel ? String(this.academicLevel?.id) : undefined,
            subject: this.subject ? String(this.subject?.id) : undefined,
            axis: this.axis ? String(this.axis?.id) : undefined,
            ordering: this.ordering?.id
        };
    }
}

export type PostsQueryParams = {
    page?: string | undefined,
    search?: string | undefined,
    userId?: string | undefined,
    academicLevel?: string | undefined,
    subject?: string | undefined,
    axis?: string | undefined,
    ordering?: OrderingType | undefined
}

export type APIPostsQueryParams = {
    page?: string,
    search?: string,
    user__id?: string,
    academic_level__id?: string,
    axis__subject__id?: string,
    axis__id?: string,
    ordering?: OrderingType | ''
}

export type IOrdering = {
    id: OrderingType,
    name: OrderingTypeName
}
