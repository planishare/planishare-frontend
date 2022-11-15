import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsRoutingModule } from './posts-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { PostDetailComponent } from './post-detail/post-detail.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { PostFormComponent } from './post-form/post-form.component';
import { PostsListComponent } from './posts-list/posts-list.component';
import { PostsFiltersComponent } from './components/posts-filters/posts-filters.component';
import { PostCardComponent } from './components/post-card/post-card.component';
import { PostCardShimmerComponent } from './components/post-card-shimmer/post-card-shimmer.component';

@NgModule({
    declarations: [
        PostDetailComponent,
        DeleteDialogComponent,
        PostFormComponent,
        PostsListComponent,
        PostsFiltersComponent,
        PostCardComponent,
        PostCardShimmerComponent
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
