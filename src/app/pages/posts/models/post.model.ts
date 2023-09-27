import { IUserSimpleDetail, UserSimpleDetail } from "../../user/models/user.model";
import { DOCUMENT_VIEWER, FILE_COLOR } from "./files.constants";
import { viewerType } from "ngx-doc-viewer";

export interface IPostDetail {
    id: number,
    user: IUserSimpleDetail,
    title: string,
    description: string,
    academic_level: IAcademicLevel,
    axis: IAxis,
    main_file: string,
    suporting_material: string[]|null,
    created_at: string,
    updated_at: string,
    total_likes: number,
    total_views: number,
    already_liked: number|null
}

export class PostDetail {
    public id: number;
    public user: UserSimpleDetail;
    public title: string;
    public description: string;
    public academicLevel: IAcademicLevel;
    public axis: IAxis;
    public mainFile: PostFile;
    public supportingMaterial: PostFile[];
    public totalFiles: number;
    public createdAt: Date;
    public updatedAt: Date;
    public totalLikes: number;
    public totalViews: number;
    public alreadyLiked: number|null;

    public shortDescription: string;

    constructor(post: IPostDetail) {
        this.id = post.id;
        this.user = new UserSimpleDetail(post.user);
        this.title = post.title;
        this.description = post.description;
        this.academicLevel = post.academic_level;
        this.axis = post.axis;
        this.mainFile = new PostFile(post.main_file),
        this.supportingMaterial = post.suporting_material?.map(url => new PostFile(url)) ?? [];
        this.totalFiles = (post.suporting_material?.length ?? 0) + 1;
        this.createdAt = new Date(post.created_at);
        this.updatedAt = new Date(post.updated_at);
        this.totalLikes = post.total_likes;
        this.totalViews = post.total_views;
        this.alreadyLiked = post.already_liked;
        this.shortDescription = PostDetail.setShortDescription(post.description);
    }

    private static setShortDescription(description: string): string {
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
    accentColor: string,
    ngxDocViewer: viewerType|null
}

export class PostFile {
    public url: string;
    public fullName: string;
    public name: string;
    public ext: string;
    public accentColor: string;
    public ngxDocViewer: viewerType|null;

    // To upload file
    public progress: number;
    public uploadCompleted: boolean;

    constructor(url: string, file?: File) {
        if (!!file) {
            // Create using File
            this.name = file.name.split('.')[0];
            this.ext = '.' + file.name.split('.').pop() ?? '';
            this.fullName = file.name;

            this.progress = 0;
            this.uploadCompleted = false;
        } else {
            // Create using URL
            this.name = decodeURIComponent(url.split('/o/')[1].split('?')[0]).split('___')[0];
            this.ext = url.match(/\.[a-z]+\?/g)?.at(0)?.slice(0, -1) ?? '';
            this.fullName = this.name + this.ext;

            this.progress = 100;
            this.uploadCompleted = true;
        }

        // TODO: Simplify this
        this.url = url;
        this.accentColor = FILE_COLOR[this.ext.slice(1) as keyof typeof FILE_COLOR];
        this.ngxDocViewer = DOCUMENT_VIEWER[this.ext.replace('.','')] ?? null;
    }
}

export interface IPostForm {
    user?: number,
    title: string,
    description: string,
    academic_level: number,
    axis: number,
    main_file?: string,
    suporting_material?: string[]
}
