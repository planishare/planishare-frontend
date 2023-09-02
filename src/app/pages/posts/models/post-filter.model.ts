import { IFilterOption } from "src/app/shared/models/filter.model";
import { PostOrderingType } from "./posts-filter.enum";
import { IAcademicLevel, IAxis, ISubject } from "./post.model";

export interface IPostFilterStatus {
    page?: number;
    search?: string;
    userId?: number;
    academicLevel?: IFilterOption<number>;
    subject?: IFilterOption<number>;
    axis?: IFilterOption<number>;
    ordering?: IFilterOption<string>;
}

export class PostFilterStatus implements IPostFilterStatus {
    public page?: number;
    public search?: string;
    public userId?: number;
    public academicLevel?: IFilterOption<number>;
    public subject?: IFilterOption<number>;
    public axis?: IFilterOption<number>;
    public ordering?: IFilterOption<string>;

    constructor(data: IPostFilterStatus) {
        this.page = data.page;
        this.search = data.search;
        this.userId = data.userId;
        this.academicLevel = data.academicLevel;
        this.subject = data.subject;
        this.axis = data.axis;
        this.ordering = data.ordering;
    }

    public toURLQueryParams(): IURLPostsParams {
        return {
            page: String(this.page ?? 1),
            search: this.search ?? undefined,
            userId: this.userId ? String(this.userId) : undefined,
            academicLevel: this.academicLevel ? String(this.academicLevel?.value) : undefined,
            subject: this.subject ? String(this.subject?.value) : undefined,
            axis: this.axis ? String(this.axis?.value) : undefined,
            ordering: this.ordering ? (this.ordering?.value as PostOrderingType) : undefined
        };
    }

    public toAPIParams(): IAPIPostsParams {
        const params: IAPIPostsParams = {};
        this.page && (params.page = String(this.page));
        this.search && (params.search = this.search);
        this.userId && (params.user__id = String(this.userId));
        this.academicLevel && (params.academic_level__id = String(this.academicLevel.value));
        this.subject && (params.axis__subject__id = String(this.subject.value));
        this.axis && (params.axis__id = String(this.axis.value));
        this.ordering && (params.ordering = this.ordering.value as PostOrderingType);
        return params;
    }
}

export interface IURLPostsParams {
    page?: string,
    search?: string,
    userId?: string,
    academicLevel?: string,
    subject?: string,
    axis?: string,
    ordering?: PostOrderingType
}

export interface IAPIPostsParams {
    page?: string,
    search?: string,
    user__id?: string,
    academic_level__id?: string,
    axis__subject__id?: string,
    axis__id?: string,
    ordering?: PostOrderingType | ''
}
