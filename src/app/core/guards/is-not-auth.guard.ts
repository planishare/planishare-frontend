import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { filter, map, Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class IsNotAuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    public canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.isNotAuth();
    }

    private isNotAuth(): Observable<boolean> {
        return this.authService.loaded$
            .pipe(
                filter(loaded => !!loaded),
                switchMap(() => {
                    return this.authService.accessToken$;
                }),
                switchMap(accessToken => {
                    return !accessToken ? of(true) : this.router.navigate(['/']);
                })
            );
    }
}
