import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsRoutingModule } from './posts-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { PostDetailComponent } from './post-detail/post-detail.component';
import { UserPostsComponent } from './user-posts/user-posts.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { PostFormComponent } from './post-form/post-form.component';
import { PostsComponent } from './posts/posts.component';

@NgModule({
    declarations: [
        PostsComponent,
        PostDetailComponent,
        UserPostsComponent,
        DeleteDialogComponent,
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
