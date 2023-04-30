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
        return this.authService.servicesLoaded$
            .pipe(
                filter(loaded => !!loaded),
                switchMap(() => {
                    if (this.authService.user?.firebaseUser.emailVerified) {
                        return of(true);
                    }
                    this.commonSnackbarMsgService.showVerficatedMessage();
                    return this.router.navigate(['/','auth','login']);
                })
            );
    }
}
