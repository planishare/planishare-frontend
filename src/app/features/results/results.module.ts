import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultsRoutingModule } from './results-routing.module';
import { ResultsComponent } from './results/results.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/material/material.module';

@NgModule({
    declarations: [
        ResultsComponent
    ],
    imports: [
        CommonModule,
        ResultsRoutingModule,
        SharedModule,
        MaterialModule
    ]
})
export class ResultsModule { }
