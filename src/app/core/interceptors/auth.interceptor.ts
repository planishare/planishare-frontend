import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { filter, tap, Observable, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService
    ) {}

    public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (this.needsAccessToken(request)) {
            return this.addAccessToken(request, next);
        }
        return next.handle(request);
    }

    public addAccessToken(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return this.authService.getAccessToken().pipe(
            filter(token => !!token),
            switchMap(token => {
                const req = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                });
                // TODO: Delete this
                console.log({
                    userAnon: this.authService.user?.isAnon,
                    urlAnon: request.url.replace(environment.planishare.protectedAnon, "").replace(environment.planishare.protected, "")
                });
                return next.handle(req);
            })
        );
    }

    private needsAccessToken(request: HttpRequest<unknown>) {
        const protectedRoute = request.url.includes(environment.planishare.protected);
        const protectedAnonRoute = request.url.includes(environment.planishare.protectedAnon);
        return protectedAnonRoute || protectedRoute;
    }
}
