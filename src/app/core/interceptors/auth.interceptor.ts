import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService
    ) {}

    public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(
            this.addAccessToken(request)
        );
    }

    public addAccessToken(request: HttpRequest<any>) {
        // TODO: use getIdToken() to get updated accessToken
        const accessToken = this.authService.getAccessToken();
        const requestWithAccessToken  = request.clone({
            setHeaders: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return accessToken ? requestWithAccessToken : request;
    }
}
