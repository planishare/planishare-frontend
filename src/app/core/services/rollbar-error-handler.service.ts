import { ErrorHandler, Inject, Injectable } from '@angular/core';
import * as Rollbar from 'rollbar';
import { RollbarService } from 'src/app/app.module';

@Injectable({
    providedIn: 'root'
})
export class RollbarErrorHandlerService implements ErrorHandler {

    constructor(@Inject(RollbarService) private rollbar: Rollbar) {}

    public handleError(err:any) : void {
        this.rollbar.configure({
            payload: {
                person: {
                    id: JSON.parse(localStorage.getItem('authUserDetail') ?? '')?.id ?? 0,
                    email: JSON.parse(localStorage.getItem('authUserDetail') ?? '')?.email ?? ''
                },
                userDetail: JSON.parse(localStorage.getItem('authUserDetail') ?? '')
            }
        });
        this.rollbar.error(err.originalError || err);
    }

}
