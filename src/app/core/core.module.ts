import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { FirebaseAuthService } from './services/firebase-auth.service';
import { RollbarErrorHandlerService } from './services/rollbar-error-handler.service';

import { IsAuthGuard } from './guards/is-auth.guard';
import { IsNotAuthGuard } from './guards/is-not-auth.guard';
import { IsVerificatedGuard } from './guards/is-verificated.guard';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        HttpClientModule
    ],
    providers: [
        AuthService,
        UsersService,
        FirebaseAuthService,
        RollbarErrorHandlerService,

        // Guards
        IsAuthGuard,
        IsNotAuthGuard,
        IsVerificatedGuard
    ]
})
export class CoreModule { }
