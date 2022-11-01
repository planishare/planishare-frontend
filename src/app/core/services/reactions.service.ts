import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ReactionsService {
    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    public toggleLike(userId: number, postId: number): Observable<{ id: number }> {
        return this.http.post<{ id: number }>(environment.apiUrl + `/likes/toggle/`, {
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
