import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAuthGuard } from 'src/app/core/guards/is-auth.guard';
import { IsVerificatedGuard } from 'src/app/core/guards/is-verificated.guard';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostFormComponent } from './post-form/post-form.component';
import { PostsListComponent } from './posts-list/posts-list.component';

const routes: Routes = [
    {
        path: 'list',
        component: PostsListComponent
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
        component: PostFormComponent,
        canActivate: [IsAuthGuard, IsVerificatedGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PostsRoutingModule { }
