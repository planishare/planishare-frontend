import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostsRoutingModule } from './posts-routing.module';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PostDetailCardShimmerComponent } from './components/post-detail-card-shimmer/post-detail-card-shimmer.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { UserPostsComponent } from './user-posts/user-posts.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';

@NgModule({
    declarations: [
        PostDetailComponent,
        PostDetailCardShimmerComponent,
        CreatePostComponent,
        UserPostsComponent,
        DeleteDialogComponent
    ],
    imports: [
        CommonModule,
        PostsRoutingModule,
        SharedModule
    ]
})
export class PostsModule { }
