import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IPageable } from '../../../shared/models/pageable.model';
import { APIPostsParams } from '../models/post-filter.model';
import { IPostDetail, IAcademicLevel, ISubject, IAxis, ISubjectWithAxis, IPostForm } from '../models/post.model';

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    private academicLevels?: IAcademicLevel[];
    private subjects?: ISubject[];
    private axes?: IAxis[];
    private subjectWithAxes?: ISubjectWithAxis[];

    constructor(
        private http: HttpClient
    ) { }

    public getPosts(queryParams: APIPostsParams): Observable<IPageable<IPostDetail>> {
        return this.http.get<IPageable<IPostDetail>>(environment.planishare.protectedAnon + '/posts/', {
            params: { ...queryParams }
        });
    }

    public getLatestPosts(): Observable<IPostDetail[]> {
        return this.http.get<IPostDetail[]>(environment.planishare.protected + '/posts/latest/');
    }

    public getPopularPosts(): Observable<IPostDetail[]> {
        return this.http.get<IPostDetail[]>(environment.planishare.protected + '/posts/popular/');
    }

    public getMostLikedPosts(): Observable<IPostDetail[]> {
        return this.http.get<IPostDetail[]>(environment.planishare.protected + '/posts/most-liked/');
    }

    public getPostById(postId: number): Observable<IPostDetail> {
        return this.http.get<IPostDetail>(environment.planishare.protectedAnon + `/posts/${postId}/`);
    }

    public deletePostById(postId: number): Observable<IPostDetail> {
        return this.http.delete<IPostDetail>(environment.planishare.protected + `/posts/delete/${postId}/`);
    }

    public updatePostById(postId: number, postData: IPostForm): Observable<IPostDetail> {
        return this.http.patch<IPostDetail>(environment.planishare.protected + `/posts/update/${postId}/`, postData);
    }

    public createPost(postData: IPostForm): Observable<any> {
        return this.http.post(environment.planishare.protected + '/posts/create/', postData);
    }

    // Academic Level, Subjects and IAxis
    public getAcademicLevels(): Observable<IAcademicLevel[]> {
        if (!!!this.academicLevels) {
            return this.http.get<IAcademicLevel[]>(environment.planishare.protectedAnon + '/academic-levels/').pipe(
                tap(data => this.academicLevels = data)
            );
        }
        return of(this.academicLevels);
    }

    public getSubjects(): Observable<ISubject[]> {
        if (!!!this.subjects) {
            return this.http.get<ISubject[]>(environment.planishare.protectedAnon + '/subjects/').pipe(
                tap(data => this.subjects = data)
            );
        }
        return of(this.subjects);
    }

    public getAxes(): Observable<IAxis[]> {
        if (!!!this.axes) {
            return this.http.get<IAxis[]>(environment.planishare.protectedAnon + '/axis/').pipe(
                tap(data => this.axes = data)
            );
        }
        return of(this.axes);
    }

    public getSubjectWithAxis(): Observable<ISubjectWithAxis[]> {
        if (!!!this.subjectWithAxes) {
            return this.http.get<ISubjectWithAxis[]>(environment.planishare.protectedAnon + '/subjects-with-axis/').pipe(
                tap(data => this.subjectWithAxes = data)
            );
        }
        return of(this.subjectWithAxes);
    }
}
