import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { filter, Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class IsAuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    public canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.isAuth();
    }

    // TODO: Allow redirect to specific route after redirect to login
    private isAuth(): Observable<boolean> {
        return this.authService.loaded$
            .pipe(
                filter(loaded => !!loaded),
                switchMap(() => {
                    return this.authService.accessToken$;
                }),
                switchMap(accessToken => {
                    return !!accessToken ? of(true) : this.router.navigate(['/','auth','login']);
                })
            );
    }
}
