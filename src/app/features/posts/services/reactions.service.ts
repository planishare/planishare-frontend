import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class ReactionsService {
    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    public toggleLike(userId: number, postId: number): Observable<{ id: number }> {
        return this.http.post<{ id: number }>(environment.planishare.protected + `/likes/toggle/`, {
            user: userId,
            post: postId
        });
    }

    public registerView(postId: number): Observable<any> {
        return this.authService.getAccessToken().pipe(
            switchMap(accessToken => {
                const body = {
                    firebase_user_id: accessToken,
                    post: postId
                };
                return this.http.post<any>(environment.planishare.protected + '/views/create/', body);
            })
        );
    }
}
