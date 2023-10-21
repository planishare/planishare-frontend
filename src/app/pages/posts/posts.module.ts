import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { PostsRoutingModule } from './posts-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { IconsModule } from 'src/app/shared/icons/icons.module';

import { PostsListComponent } from './pages/posts-list/posts-list.component';
import { PostCardComponent } from './components/post-card/post-card.component';
import { PostsFiltersComponent } from './components/posts-filters/posts-filters.component';
import { PostFilterTagsComponent } from './components/post-filter-tags/post-filter-tags.component';
import { PostCardShimmerComponent } from './components/post-card-shimmer/post-card-shimmer.component';
import { PostDetailComponent } from './pages/post-detail/post-detail.component';
import { UserPostsStatsComponent } from './components/user-posts-stats/user-posts-stats.component';
import { PostFormComponent } from './pages/post-form/post-form.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';

@NgModule({
    declarations: [
        PostsListComponent,
        PostCardComponent,
        PostsFiltersComponent,
        PostFilterTagsComponent,
        PostCardShimmerComponent,
        PostDetailComponent,
        UserPostsStatsComponent,
        PostFormComponent,
        DeleteDialogComponent
    ],
    imports: [
        CommonModule,
        PostsRoutingModule,
        SharedModule,
        MaterialModule,
        ReactiveFormsModule,
        NgxDocViewerModule,
        NgxMatSelectSearchModule,
        IconsModule
    ]
})
export class PostsModule { }
