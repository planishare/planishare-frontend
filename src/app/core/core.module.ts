import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsService } from './services/posts.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { IsAuthGuard } from './guards/is-auth.guard';
import { IsNotAuthGuard } from './guards/is-not-auth.guard';
import { UsersService } from './services/users.service';
import { ReactionsService } from './services/reactions.service';
import { FirebaseAuthService } from './services/firebase-auth.service';
import { RollbarErrorHandlerService } from './services/rollbar-error-handler.service';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        HttpClientModule
    ],
    providers: [
        // Services
        PostsService,
        AuthService,
        UsersService,
        ReactionsService,
        FirebaseAuthService,
        RollbarErrorHandlerService,

        // Guards
        IsAuthGuard,
        IsNotAuthGuard
    ]
})
export class CoreModule { }
