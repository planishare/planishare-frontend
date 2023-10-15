import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomepageRoutingModule } from './homepage-routing.module';

import { HomepageComponent } from './homepage/homepage.component';
import { IconsModule } from 'src/app/shared/icons/icons.module';

@NgModule({
    declarations: [
        HomepageComponent
    ],
    imports: [
        CommonModule,
        HomepageRoutingModule,
        IconsModule
    ]
})
export class HomepageModule { }
