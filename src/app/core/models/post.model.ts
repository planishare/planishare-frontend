import { IUserSimpleDetail, UserSimpleDetail } from "./user.model";
import { FILE_TAG_COLOR } from "../constants/files.constants";

export interface IPostDetail {
    id: number,
    user: IUserSimpleDetail,
    title: string,
    description: string,
    image: string,
    academic_level: IAcademicLevel,
    axis: IAxis,
    main_file: string,
    suporting_material: string[],
    created_at: string | Date,
    updated_at: string | Date,
    total_likes: number,
    total_views: number,
    already_liked?: number
}

export class PostDetail {
    public id: number;
    public user: UserSimpleDetail;
    public title: string;
    public description: string;
    public shortDescription: string;
    public image: string;
    public academicLevel: IAcademicLevel;
    public axis: IAxis;
    public mainFile: IPostFile;
    public supportingMaterial: IPostFile[];
    public totalFiles: number;
    public createdAt: string | Date;
    public updatedAt: string | Date;
    public totalLikes: number;
    public totalViews: number;
    public alreadyLiked?: number;

    constructor(post: IPostDetail) {
        this.id = post.id;
        this.user = new UserSimpleDetail(post.user);
        this.title = post.title;
        this.description = post.description;
        this.shortDescription = this.setShortDescription(post.description);
        this.image = post.image;
        this.academicLevel = post.academic_level;
        this.axis = post.axis;
        this.mainFile = this.setFileInfo(post.main_file);
        this.supportingMaterial = post.suporting_material.map(this.setFileInfo);
        this.totalFiles = post.suporting_material.length + 1;
        this.createdAt = post.created_at;
        this.updatedAt = post.updated_at;
        this.totalLikes = post.total_likes;
        this.totalViews = post.total_views;
        this.alreadyLiked = post.already_liked;
    }

    private setFileInfo(url: string): IPostFile {
        const fileTypes = FILE_TAG_COLOR;
        const name = decodeURIComponent(url.split('/o/')[1].split('?')[0]).split('___')[0];
        const ext = url.match(/\.[a-z]+\?/g)?.at(0)?.slice(0, -1) ?? 'nd';
        const tagColor = fileTypes[ext.slice(1) as keyof typeof fileTypes];
        return {
            url,
            name,
            ext,
            tagColor
        };
    }

    private setShortDescription(description: string): string {
        const textLength = 150;
        return description.length > textLength
            ? description.slice(0, textLength) + '...'
            : description;
    }
}

export interface IAcademicLevel {
    id: number,
    name: string
}

export interface ISubject {
    id: number,
    name: string
}

export interface IAxis {
    id: number,
    name: string,
    subject: ISubject
}

export interface IPostFile {
    url: string,
    name: string,
    ext: string,
    tagColor: string
}
