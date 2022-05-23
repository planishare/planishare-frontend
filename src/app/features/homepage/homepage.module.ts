import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomepageRoutingModule } from './homepage-routing.module';
import { HomepageComponent } from './homepage/homepage.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ResultsComponent } from './results/results.component';
import { ResultsShimmerComponent } from './components/results-shimmer/results-shimmer.component';

@NgModule({
    declarations: [
        HomepageComponent,
        ResultsComponent,
        ResultsShimmerComponent
    ],
    imports: [
        CommonModule,
        HomepageRoutingModule,
        SharedModule
    ]
})
export class HomepageModule { }
