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

    // TODO: Refactor this to send firebase user id instead JWT
    public registerView(postId: number): Observable<any> {
        return this.authService.accessToken$.pipe(
            switchMap(accessToken => {
                let id = accessToken;
                if (!accessToken) {
                    let noAuthId = localStorage.getItem('noAuthId');
                    if (!noAuthId) {
                        noAuthId = crypto.randomUUID();
                        localStorage.setItem('noAuthId', noAuthId);
                    }
                    id = `NO_AUTH_${noAuthId}`;
                }
                const body = {
                    firebase_user_id: id,
                    post: postId
                };
                return this.http.post<any>(environment.planishare.public + '/views/create/', body);
            })
        );
    }
}
