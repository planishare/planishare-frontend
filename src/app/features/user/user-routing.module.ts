import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAuthGuard } from 'src/app/core/guards/is-auth.guard';
import { IsVerificatedGuard } from 'src/app/core/guards/is-verificated.guard';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

const routes: Routes = [
    {
        path: 'edit-profile',
        component: EditProfileComponent,
        canActivate: [IsAuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }
