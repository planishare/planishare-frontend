import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { filter, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class IsAuthGuard implements CanActivate {
    constructor(
        private authService: AuthService
    ) {}

    public canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return true;
    }

    // private isAuth(): Observable<boolean> {
    //     return this.authService.isAuth
    //         .asObservable()
    //         .pipe(
    //             filter(val => val !== null)
    //         );
    // }
}
