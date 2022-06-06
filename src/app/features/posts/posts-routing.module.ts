import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAuthGuard } from 'src/app/core/guards/is-auth.guard';
import { CreatePostComponent } from './create-post/create-post.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { UserPostsComponent } from './user-posts/user-posts.component';

const routes: Routes = [
    {
        path: 'view/:id',
        component: PostDetailComponent
    },
    {
        path: 'create',
        component: CreatePostComponent,
        canActivate: [IsAuthGuard]
    },
    {
        path: 'edit/:id',
        component: EditPostComponent,
        canActivate: [IsAuthGuard]
    },
    {
        path: 'user',
        component: UserPostsComponent,
        canActivate: [IsAuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PostsRoutingModule { }
