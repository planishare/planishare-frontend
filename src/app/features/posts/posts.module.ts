import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostsRoutingModule } from './posts-routing.module';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    declarations: [
        PostDetailComponent
    ],
    imports: [
        CommonModule,
        PostsRoutingModule,
        SharedModule
    ]
})
export class PostsModule { }
