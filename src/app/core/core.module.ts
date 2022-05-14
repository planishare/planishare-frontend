import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavService } from './services/sidenav.service';
import { PostsService } from './services/posts.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { IsAuthGuard } from './guards/is-auth.guard';
import { IsNotAuthGuard } from './guards/is-not-auth.guard';
import { UsersService } from './services/users.service';
import { ReactionsService } from './services/reactions.service';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        HttpClientModule
    ],
    providers: [
        // Services
        SidenavService,
        PostsService,
        AuthService,
        UsersService,
        ReactionsService,

        // Guards
        IsAuthGuard,
        IsNotAuthGuard
    ]
})
export class CoreModule { }
