import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAuthGuard } from 'src/app/core/guards/is-auth.guard';
import { IsVerificatedGuard } from 'src/app/core/guards/is-verificated.guard';
import { EditPostComponent } from './edit-post/edit-post.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostFormComponent } from './post-form/post-form.component';
import { PostsComponent } from './posts/posts.component';
import { UserPostsComponent } from './user-posts/user-posts.component';

const routes: Routes = [
    {
        path: '',
        component: PostsComponent
    },
    {
        path: 'view/:id',
        component: PostDetailComponent
    },
    {
        path: 'create',
        component: PostFormComponent,
        canActivate: [IsAuthGuard, IsVerificatedGuard]
    },
    {
        path: 'edit/:id',
        component: EditPostComponent,
        canActivate: [IsAuthGuard, IsVerificatedGuard]
    },
    {
        path: 'user',
        component: UserPostsComponent,
        canActivate: [IsAuthGuard, IsVerificatedGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PostsRoutingModule { }
