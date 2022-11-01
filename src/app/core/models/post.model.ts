import { IUserSimpleDetail, UserSimpleDetail } from "./user.model";
import { DOCUMENT_VIEWER, FILE_TAG_COLOR } from "../../shared/constants/files.constants";
import { viewerType } from "ngx-doc-viewer";

export interface IPostDetail {
    id: number,
    user: IUserSimpleDetail,
    title: string,
    description: string,
    image: string,
    academic_level: IAcademicLevel,
    axis: IAxis,
    main_file: string,
    suporting_material: string[] | null,
    created_at: string | Date,
    updated_at: string | Date,
    total_likes: number,
    total_views: number,
    already_liked: number | null
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
    public mainFile: PostFile;
    public supportingMaterial: PostFile[];
    public totalFiles: number;
    public createdAt: string | Date;
    public updatedAt: string | Date;
    public totalLikes: number;
    public totalViews: number;
    public alreadyLiked: number | null;

    constructor(post: IPostDetail) {
        this.id = post.id;
        this.user = new UserSimpleDetail(post.user);
        this.title = post.title;
        this.description = post.description;
        this.shortDescription = this.setShortDescription(post.description);
        this.image = post.image;
        this.academicLevel = post.academic_level;
        this.axis = post.axis;
        this.mainFile = new PostFile(post.main_file),
        this.supportingMaterial = post.suporting_material?.map(url => new PostFile(url)) ?? [];
        this.totalFiles = (post.suporting_material?.length ?? 0) + 1;
        this.createdAt = post.created_at;
        this.updatedAt = post.updated_at;
        this.totalLikes = post.total_likes;
        this.totalViews = post.total_views;
        this.alreadyLiked = post.already_liked;
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

export type ISubjectWithAxis = {
    id: number,
    name: string,
    axis: IAxis[]
}

export interface IPostFile {
    url: string,
    name: string,
    fullName: string,
    ext: string,
    tagColor: string,
    ngxDocViewer: viewerType | null
}

export class PostFile {
    public url: string;
    public name: string;
    public fullName: string;
    public ext: string;
    public tagColor: string;
    public ngxDocViewer: viewerType | null;

    // For upload file
    public progress: number;
    public uploadCompleted: boolean;

    constructor(url: string, file?: File) {
        if (!!file) {
            this.name = file.name.split('.')[0];
            this.ext = '.' + file.name.split('.').pop() ?? '';
            this.fullName = file.name;
            this.progress = 0;
            this.uploadCompleted = false;
        } else {
            this.name = decodeURIComponent(url.split('/o/')[1].split('?')[0]).split('___')[0];
            this.ext = url.match(/\.[a-z]+\?/g)?.at(0)?.slice(0, -1) ?? '';
            this.fullName = this.name + this.ext;
            this.progress = 100;
            this.uploadCompleted = true;
        }

        const fileTypeColors = FILE_TAG_COLOR;
        this.url = url;
        this.tagColor = fileTypeColors[this.ext.slice(1) as keyof typeof fileTypeColors];
        this.ngxDocViewer = DOCUMENT_VIEWER[this.ext.replace('.','')] ?? null;
    }
}

export type IPostForm = {
    user?: number,
    title: string,
    description: string,
    academic_level: number,
    axis: number,
    main_file?: string,
    suporting_material?: string[]
}
