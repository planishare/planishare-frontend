import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AcademicLevel, Axis, PostDetail, PostPageable, PostsQueryParams, RealPostsQueryParams, Subject } from '../types/posts.type';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    constructor(
        private http: HttpClient,
        private authService: AuthService
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

        return this.http.get<PostPageable>(environment.API_URL + '/posts/', {
            params
        });
    }

    public getLatestPosts(): Observable<PostDetail[]> {
        return this.http.get<PostDetail[]>(environment.API_URL + '/posts/latest/');
    }

    public getMostLikedPosts(): Observable<PostDetail[]> {
        return this.http.get<PostDetail[]>(environment.API_URL + '/posts/most-liked/');
    }

    // Academic Level, Subjects and Axis
    public getAcademicLevels(): Observable<AcademicLevel[]> {
        return this.http.get<AcademicLevel[]>(environment.API_URL + '/academic-levels/');
    }

    public getSubjects(): Observable<Subject[]> {
        return this.http.get<Subject[]>(environment.API_URL + '/subjects/');
    }

    public getAxes(): Observable<Axis[]> {
        return this.http.get<Axis[]>(environment.API_URL + '/axis/');
    }
}
