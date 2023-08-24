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
        const authUserDetail = JSON.parse(localStorage.getItem('authUserDetail') ?? '{}');
        this.rollbar.configure({
            payload: {
                person: {
                    id: authUserDetail.id ?? 0,
                    email: authUserDetail.email ?? ''
                },
                userDetail: authUserDetail
            }
        });
        const reportedError = error.name === 'HttpErrorResponse' ? (error as HttpErrorResponse).message : (error as Error);
        this.rollbar.error(reportedError);
    }

}
