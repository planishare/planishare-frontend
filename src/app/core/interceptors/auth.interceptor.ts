import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { from, map, Observable, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService
    ) {}

    public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return this.addAccessToken(request, next);
    }

    public addAccessToken(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return this.authService.getAccessToken().pipe(
            switchMap(accessToken => {
                const requestWithAccessToken  = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                return next.handle(accessToken ? requestWithAccessToken : request);
            })
        );
    }
}
