import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AcademicLevel, Axis, PostDetail, PostForm, PostPageable, PostsQueryParams, RealPostsQueryParams, Subject } from '../types/posts.type';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    constructor(
        private http: HttpClient
    ) { }

    public getPosts(queryParams: PostsQueryParams): Observable<PostPageable> {
        const params: RealPostsQueryParams = {
            page: queryParams.page ?? 1,
            search: queryParams.search ?? '',
            user__id: queryParams.userId ?? '',
            academic_level__id: queryParams.academicLevel ?? '',
            axis__subject__id: queryParams.subject ?? '',
            axis__id: queryParams.axis ?? '',
            ordering: queryParams.ordering ?? ''
        };

        return this.http.get<PostPageable>(environment.apiUrl + '/posts/', {
            params
        });
    }

    public getLatestPosts(): Observable<PostDetail[]> {
        return this.http.get<PostDetail[]>(environment.apiUrl + '/posts/latest/');
    }

    public getPopularPosts(): Observable<PostDetail[]> {
        return this.http.get<PostDetail[]>(environment.apiUrl + '/posts/popular/');
    }

    public getPostById(postId: number): Observable<PostDetail> {
        return this.http.get<PostDetail>(environment.apiUrl + `/posts/${postId}/`);
    }

    // Academic Level, Subjects and Axis
    public getAcademicLevels(): Observable<AcademicLevel[]> {
        return this.http.get<AcademicLevel[]>(environment.apiUrl + '/academic-levels/');
    }

    public getSubjects(): Observable<Subject[]> {
        return this.http.get<Subject[]>(environment.apiUrl + '/subjects/');
    }

    public getAxes(): Observable<Axis[]> {
        return this.http.get<Axis[]>(environment.apiUrl + '/axis/');
    }

    public createPost(postData: PostForm): Observable<any> {
        return this.http.post(environment.apiUrl + '/posts/create/', postData);
    }
}
