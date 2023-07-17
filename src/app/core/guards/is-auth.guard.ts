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
        // Return true if auth user is NOT anonymous
        return this.isAuth();
    }

    private isAuth(): Observable<boolean> {
        return this.authService.servicesLoaded$
            .pipe(
                filter(loaded => !!loaded),
                switchMap(() => {
                    // TODO: Allow redirect to specific route after redirect to login
                    const isAuth = !this.authService.user?.isAnon;
                    return isAuth ? of(true) : this.router.navigate(['/','auth','login']);
                })
            );
    }
}
