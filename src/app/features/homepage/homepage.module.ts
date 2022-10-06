import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomepageRoutingModule } from './homepage-routing.module';
import { HomepageComponent } from './homepage/homepage.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TopsComponent } from './tops/tops.component';
import { MaterialModule } from 'src/app/shared/material/material.module';

@NgModule({
    declarations: [
        HomepageComponent,
        TopsComponent
    ],
    imports: [
        CommonModule,
        HomepageRoutingModule,
        SharedModule,
        MaterialModule
    ]
})
export class HomepageModule { }
