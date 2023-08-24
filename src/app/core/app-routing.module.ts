import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { IsNotAuthGuard } from './guards/is-not-auth.guard';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';

const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('../features/homepage/homepage.module').then(mod => mod.HomepageModule)
            },
            {
                path: 'auth',
                loadChildren: () => import('../features/auth/auth.module').then(mod => mod.AuthModule),
                canActivate: [IsNotAuthGuard]
            },
            {
                path: 'posts',
                loadChildren: () => import('../features/posts/posts.module').then(mod => mod.PostsModule)
            },
            {
                path: 'user',
                loadChildren: () => import('../features/user/user.module').then(mod => mod.UserModule)
            }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];

@NgModule({
    imports: [RouterModule.forRoot(
        routes,
        {
            preloadingStrategy: PreloadAllModules
        }
    )],
    exports: [RouterModule]
})
export class AppRoutingModule { }
