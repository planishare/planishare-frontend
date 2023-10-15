import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Inject, Injectable } from '@angular/core';
import * as Rollbar from 'rollbar';
import { RollbarService } from '../app.module';

@Injectable({
    providedIn: 'root'
})
export class RollbarErrorHandlerService implements ErrorHandler {

    constructor(@Inject(RollbarService) private rollbar: Rollbar) {}

    public handleError(error: Error | HttpErrorResponse) : void {
        console.error(error);

        // Reload when a request fail because the token has expired
        if (error instanceof HttpErrorResponse && error.status === 403 && error.error.detail.includes('Token expired')) {
            location.reload();
        } else {
            const authUserDetail = JSON.parse(localStorage.getItem('authUserDetail') ?? '{}');
            this.rollbar.configure({
                payload: {
                    person: { id: authUserDetail.id ?? 0, email: authUserDetail.email ?? '' },
                    userDetail: authUserDetail
                }
            });

            const reportedError = error instanceof HttpErrorResponse ? error.message : error;
            this.rollbar.error(reportedError);
        }
    }

}
