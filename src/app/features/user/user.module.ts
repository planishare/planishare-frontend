import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { UserRoutingModule } from './user-routing.module';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { EditProfileComponent } from './edit-profile/edit-profile.component';

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
