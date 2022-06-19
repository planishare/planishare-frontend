import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LikeDetail } from '../types/reactions.type';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ReactionsService {
    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    public createLike(userId: number, postId: number): Observable<LikeDetail> {
        const body = {
            user: userId,
            post: postId
        };
        return this.http.post<LikeDetail>(environment.apiUrl + '/likes/create/', body);
    }

    public deleteLike(likeId: number): Observable<any> {
        return this.http.delete(environment.apiUrl + `/likes/delete/${likeId}/`);
    }

    public toggleLike(userId: number, postId: number): Observable<{id: number|null}> {
        return this.http.post<{id: number|null}>(environment.apiUrl + `/likes/toggle/`, {
            user: userId,
            post: postId
        });
    }

    public registerView(postId: number): Observable<any> {
        const body = {
            firebase_user_id: this.authService.getAccessToken(),
            post: postId
        };
        return this.http.post<any>(environment.apiUrl + '/views/create/', body);
    }
}
