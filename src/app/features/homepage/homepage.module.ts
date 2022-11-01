import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomepageRoutingModule } from './homepage-routing.module';
import { HomepageComponent } from './homepage/homepage.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
    declarations: [
        HomepageComponent
    ],
    imports: [
        CommonModule,
        HomepageRoutingModule,
        SharedModule,
        MaterialModule
    ]
})
export class HomepageModule { }
