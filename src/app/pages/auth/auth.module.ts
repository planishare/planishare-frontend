import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material.module';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordDialogComponent } from './components/forgot-password-dialog/forgot-password-dialog.component';

@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
        ForgotPasswordDialogComponent
    ],
    imports: [
        CommonModule,
        AuthRoutingModule,
        SharedModule,
        MaterialModule,
        ReactiveFormsModule
    ]
})
export class AuthModule { }
