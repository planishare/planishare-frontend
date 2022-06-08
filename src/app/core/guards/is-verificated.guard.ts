import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { filter, Observable, of, switchMap } from 'rxjs';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class IsVerificatedGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router,
        private commonSnackbarMsgService: CommonSnackbarMsgService
    ) {}

    public canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.isVerificated();
    }

    private isVerificated(): Observable<boolean> {
        return this.authService.isCompleted$.asObservable()
            .pipe(
                filter(isAuthComplete => !!isAuthComplete),
                switchMap(() => {
                    return this.authService.isAuth$.asObservable();
                }),
                switchMap(isAuth => {
                    if (isAuth?.emailVerified) {
                        return of(true);
                    }
                    this.commonSnackbarMsgService.showVerficatedMessage();
                    return this.router.navigate(['/','auth','login']);
                })
            );
    }
}
