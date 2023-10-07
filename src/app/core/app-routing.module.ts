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
                loadChildren: () => import('../pages/homepage/homepage.module').then(mod => mod.HomepageModule)
            },
            {
                path: 'auth',
                loadChildren: () => import('../pages/auth/auth.module').then(mod => mod.AuthModule),
                canActivate: [IsNotAuthGuard]
            },
            {
                path: 'posts',
                loadChildren: () => import('../pages/posts/posts.module').then(mod => mod.PostsModule)
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
