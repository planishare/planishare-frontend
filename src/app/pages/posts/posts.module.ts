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
// import { PostDetailComponent } from './pages/post-detail/post-detail.component';
// import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
// import { PostFormComponent } from './pages/post-form/post-form.component';
// import { PostCardShimmerComponent } from './components/post-card-shimmer/post-card-shimmer.component';
// import { PostFiltersCardComponent } from './components/post-filters-card/post-filters-card.component';
// import { PostPaginatedListComponent } from './components/post-paginated-list/post-paginated-list.component';
// import { UserPostsStatsComponent } from './components/user-posts-stats/user-posts-stats.component';

@NgModule({
    declarations: [
        PostsListComponent,
        PostsGridComponent,
        PostCardComponent
        // PostDetailComponent,
        // DeleteDialogComponent,
        // PostFormComponent,
        // PostCardShimmerComponent,
        // PostFiltersCardComponent,
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
        NgxMatSelectSearchModule
    ]
})
export class PostsModule { }
