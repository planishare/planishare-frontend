import { Inject, Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { RollbarService } from 'src/app/app.module';
import * as Rollbar from 'rollbar';

@Injectable()
export class RollbarHttpErrorInterceptor implements HttpInterceptor {

    constructor(@Inject(RollbarService) private rollbar: Rollbar) {}

    public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                this.rollbar.configure({
                    payload: {
                        person: {
                            id: JSON.parse(localStorage.getItem('userProfile') ?? '')?.id ?? 0,
                            email: JSON.parse(localStorage.getItem('userProfile') ?? '')?.email ?? ''
                        },
                        userProfile: JSON.parse(localStorage.getItem('userProfile') ?? '')
                    }
                });
                this.rollbar.error({
                    ...error,
                    message: {
                        message: error.message,
                        response: error.error
                    }
                });
                return throwError(() => error);
            })
        );
    }
}
