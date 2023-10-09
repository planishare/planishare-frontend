import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PostsListComponent } from './pages/posts-list/posts-list.component';
import { PostDetailComponent } from './pages/post-detail/post-detail.component';
import { IsAuthGuard } from 'src/app/core/guards/is-auth.guard';
import { PostFormComponent } from './pages/post-form/post-form.component';
// import { IsVerificatedGuard } from 'src/app/core/guards/is-verificated.guard';

const routes: Routes = [
    {
        path: '',
        component: PostsListComponent
    },
    {
        path: 'view/:id',
        component: PostDetailComponent
    },
    {
        path: 'own-posts',
        component: PostsListComponent,
        canActivate: [IsAuthGuard]
    },
    {
        path: 'create',
        component: PostFormComponent,
        // canActivate: [IsAuthGuard, IsVerificatedGuard]
        canActivate: [IsAuthGuard]
    },
    {
        path: 'edit/:id',
        component: PostFormComponent,
        canActivate: [IsAuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PostsRoutingModule { }
