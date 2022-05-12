import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsNotAuthGuard } from './core/guards/is-not-auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('./features/homepage/homepage.module').then(mod => mod.HomepageModule)
            },
            {
                path: 'posts',
                loadChildren: () => import('./features/posts/posts.module').then(mod => mod.PostsModule)
            }
        ]
    },
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.module').then(mod => mod.AuthModule),
        canActivate: [IsNotAuthGuard]
    },
    {
        path: '**',
        redirectTo: ''
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
