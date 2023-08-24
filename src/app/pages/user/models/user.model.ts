import { IEducation, IInstitution } from "./institution.model";
import { ICommune } from "./location.model";

export interface IUserSimpleDetail {
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    education: IEducation | null,
    institution: IInstitution | null
}

export class UserSimpleDetail {
    public id: number;
    public email: string;
    public firstName?: string;
    public lastName?: string;
    public fullName?: string;
    public education?: IEducation;
    public institution?: IInstitution;

    constructor (user: IUserSimpleDetail) {
        this.id = user.id;
        this.email = user.email;
        this.firstName = user.first_name;
        this.lastName = user.last_name;
        this.fullName = this.getFullName(user.first_name, user.last_name);
        this.education = user.education ?? undefined;
        this.institution = user.institution ?? undefined;
    }

    private getFullName(firstName: string, lastName: string): string | undefined {
        if (firstName && lastName) {
            return `${firstName} ${lastName}`;
        }
        if (firstName !== '') {
            return firstName;
        }
        if (lastName !== '') {
            return lastName;
        }
        return undefined;
    }
}

export interface IUserDetail {
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    education: IEducation,
    institution: IInstitution
    commune: ICommune,
    created_at: string,
    updated_at: string,
    total_likes: number,
    total_views: number,
    total_posts: number
}

export class UserDetail {
    public id: number;
    public email: string;
    public firstName: string;
    public lastName: string;
    public education: IEducation;
    public institution: IInstitution;
    public commune: ICommune;
    public createdAt: Date;
    public updatedAt: Date;
    public totalLikes: number;
    public totalViews: number;
    public totalPosts: number;

    constructor(user: IUserDetail) {
        this.id = user.id;
        this.email = user.email;
        this.firstName = user.first_name;
        this.lastName = user.last_name;
        this.education = user.education;
        this.institution = user.institution;
        this.commune = user.commune;
        this.createdAt = new Date(user.created_at);
        this.updatedAt = new Date(user.updated_at);
        this.totalLikes = user.total_likes;
        this.totalViews = user.total_views;
        this.totalPosts = user.total_posts;
    }

    public update(user: IUserDetail): void {
        this.firstName = user.first_name ?? this.firstName;
        this.lastName = user.last_name ?? this.lastName;
        this.education = user.education ?? this.education;
        this.institution = user.institution ?? this.institution;
        this.commune = user.commune ?? this.commune;
        this.updatedAt = user.updated_at ? new Date(user.updated_at) : this.updatedAt;
    }
}

export interface IUserForm {
    email?: string,
    first_name?: string,
    last_name?: string,
    education?: number,
    institution?: number,
    commune?: number
}
