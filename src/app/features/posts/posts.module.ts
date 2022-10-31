import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsRoutingModule } from './posts-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostDetailCardShimmerComponent } from './components/post-detail-card-shimmer/post-detail-card-shimmer.component';
import { UserPostsComponent } from './user-posts/user-posts.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { PostFormComponent } from './post-form/post-form.component';
import { PostsComponent } from './posts/posts.component';

@NgModule({
    declarations: [
        PostsComponent,
        PostDetailComponent,
        PostDetailCardShimmerComponent,
        UserPostsComponent,
        DeleteDialogComponent,
        EditPostComponent,
        PostFormComponent
    ],
    imports: [
        CommonModule,
        PostsRoutingModule,
        SharedModule,
        MaterialModule,
        ReactiveFormsModule,
        NgxDocViewerModule,
        NgxMatSelectSearchModule
    ]
})
export class PostsModule { }
