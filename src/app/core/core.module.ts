import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavService } from './services/sidenav.service';
import { PostsService } from './services/posts.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { JwtService } from './services/jwt.service';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        HttpClientModule
    ],
    providers: [
        SidenavService,
        PostsService,
        AuthService,
        JwtService
    ]
})
export class CoreModule { }
