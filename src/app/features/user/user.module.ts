import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
    declarations: [
        EditProfileComponent
    ],
    imports: [
        CommonModule,
        UserRoutingModule,
        SharedModule,
        MaterialModule,
        ReactiveFormsModule,
        NgxMatSelectSearchModule
    ]
})
export class UserModule { }
