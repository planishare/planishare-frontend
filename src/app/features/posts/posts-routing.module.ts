import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';

const routes: Routes = [
    {
        path: 'view/:id',
        component: PostDetailComponent
    },
    {
        path: 'create',
        component: CreatePostComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PostsRoutingModule { }
