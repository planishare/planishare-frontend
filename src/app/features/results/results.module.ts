import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultsRoutingModule } from './results-routing.module';
import { ResultsListComponent } from './results-list/results-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        ResultsListComponent
    ],
    imports: [
        CommonModule,
        ResultsRoutingModule,
        SharedModule,
        MaterialModule,
        ReactiveFormsModule
    ]
})
export class ResultsModule { }
