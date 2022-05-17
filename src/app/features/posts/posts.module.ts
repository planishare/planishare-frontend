import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostsRoutingModule } from './posts-routing.module';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PostDetailCardShimmerComponent } from './components/post-detail-card-shimmer/post-detail-card-shimmer.component';

@NgModule({
    declarations: [
        PostDetailComponent,
        PostDetailCardShimmerComponent
    ],
    imports: [
        CommonModule,
        PostsRoutingModule,
        SharedModule
    ]
})
export class PostsModule { }
