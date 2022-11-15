import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IPageable } from '../models/pageable.model';
import { IAPIPostsQueryParams } from '../models/post-filter.model';
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

    public getPosts(queryParams: IAPIPostsQueryParams): Observable<IPageable<IPostDetail>> {
        return this.http.get<IPageable<IPostDetail>>(environment.apiUrl + '/posts/', {
            params: { ...queryParams }
        });
    }

    public getLatestPosts(): Observable<IPostDetail[]> {
        return this.http.get<IPostDetail[]>(environment.apiUrl + '/posts/latest/');
    }

    public getPopularPosts(): Observable<IPostDetail[]> {
        return this.http.get<IPostDetail[]>(environment.apiUrl + '/posts/popular/');
    }

    public getMostLikedPosts(): Observable<IPostDetail[]> {
        return this.http.get<IPostDetail[]>(environment.apiUrl + '/posts/most-liked/');
    }

    public getPostById(postId: number): Observable<IPostDetail> {
        return this.http.get<IPostDetail>(environment.apiUrl + `/posts/${postId}/`);
    }

    public deletePostById(postId: number): Observable<IPostDetail> {
        return this.http.delete<IPostDetail>(environment.apiUrl + `/posts/delete/${postId}/`);
    }

    public updatePostById(postId: number, postData: IPostForm): Observable<IPostDetail> {
        return this.http.patch<IPostDetail>(environment.apiUrl + `/posts/update/${postId}/`, postData);
    }

    public createPost(postData: IPostForm): Observable<any> {
        return this.http.post(environment.apiUrl + '/posts/create/', postData);
    }

    // Academic Level, Subjects and IAxis
    public getAcademicLevels(): Observable<IAcademicLevel[]> {
        if (!!!this.academicLevels) {
            return this.http.get<IAcademicLevel[]>(environment.apiUrl + '/academic-levels/').pipe(
                tap(data => this.academicLevels = data)
            );
        }
        return of(this.academicLevels);
    }

    public getSubjects(): Observable<ISubject[]> {
        if (!!!this.subjects) {
            return this.http.get<ISubject[]>(environment.apiUrl + '/subjects/').pipe(
                tap(data => this.subjects = data)
            );
        }
        return of(this.subjects);
    }

    public getAxes(): Observable<IAxis[]> {
        if (!!!this.axes) {
            return this.http.get<IAxis[]>(environment.apiUrl + '/axis/').pipe(
                tap(data => this.axes = data)
            );
        }
        return of(this.axes);
    }

    public getSubjectWithAxis(): Observable<ISubjectWithAxis[]> {
        if (!!!this.subjectWithAxes) {
            return this.http.get<ISubjectWithAxis[]>(environment.apiUrl + '/subjects-with-axis/').pipe(
                tap(data => this.subjectWithAxes = data)
            );
        }
        return of(this.subjectWithAxes);
    }
}
