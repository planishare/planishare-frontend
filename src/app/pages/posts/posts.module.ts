import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { PostsRoutingModule } from './posts-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material.module';

import { PostsListComponent } from './pages/posts-list/posts-list.component';
import { PostsGridComponent } from './components/posts-grid/posts-grid.component';
import { PostCardComponent } from './components/post-card/post-card.component';
import { IconsModule } from 'src/app/shared/icons/icons.module';
import { PostsFiltersComponent } from './components/posts-filters/posts-filters.component';
import { PostFilterTagsComponent } from './components/post-filter-tags/post-filter-tags.component';
// import { PostDetailComponent } from './pages/post-detail/post-detail.component';
// import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
// import { PostFormComponent } from './pages/post-form/post-form.component';
// import { PostCardShimmerComponent } from './components/post-card-shimmer/post-card-shimmer.component';
// import { PostPaginatedListComponent } from './components/post-paginated-list/post-paginated-list.component';
// import { UserPostsStatsComponent } from './components/user-posts-stats/user-posts-stats.component';

@NgModule({
    declarations: [
        PostsListComponent,
        PostsGridComponent,
        PostCardComponent,
        PostsFiltersComponent,
        PostFilterTagsComponent
        // PostDetailComponent,
        // DeleteDialogComponent,
        // PostFormComponent,
        // PostCardShimmerComponent,
        // PostPaginatedListComponent,
        // UserPostsStatsComponent
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
