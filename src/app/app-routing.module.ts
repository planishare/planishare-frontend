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
                path: 'results',
                loadChildren: () => import('./features/results/results.module').then(mod => mod.ResultsModule)
            },
            {
                path: 'posts',
                loadChildren: () => import('./features/posts/posts.module').then(mod => mod.PostsModule)
            },
            {
                path: 'user',
                loadChildren: () => import('./features/user/user.module').then(mod => mod.UserModule)
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
