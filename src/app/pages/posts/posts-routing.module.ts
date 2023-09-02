import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { IsAuthGuard } from 'src/app/core/guards/is-auth.guard';
// import { IsVerificatedGuard } from 'src/app/core/guards/is-verificated.guard';
// import { PostDetailComponent } from './pages/post-detail/post-detail.component';
// import { PostFormComponent } from './pages/post-form/post-form.component';
import { PostsListComponent } from './pages/posts-list/posts-list.component';
// import { UserPostsComponent } from './pages/user-posts/user-posts.component';

const routes: Routes = [
    {
        path: '',
        component: PostsListComponent
    }
    // {
    //     path: 'view/:id',
    //     component: PostDetailComponent
    // },
    // {
    //     path: 'create',
    //     component: PostFormComponent,
    //     canActivate: [IsAuthGuard, IsVerificatedGuard]
    // },
    // {
    //     path: 'edit/:id',
    //     component: PostFormComponent,
    //     canActivate: [IsAuthGuard, IsVerificatedGuard]
    // }
    // {
    //     path: 'user/:id',
    //     component: UserPostsComponent,
    //     canActivate: [IsAuthGuard]
    // }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PostsRoutingModule { }
