import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../material.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { ReportDialogComponent } from './components/report-dialog/report-dialog.component';
import { RoundedSelectComponent } from './components/rounded-select/rounded-select.component';
import { ScrollToTopButtonComponent } from './components/scroll-to-top-button/scroll-to-top-button.component';

import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { FillArrayPipe } from './pipes/fill-array.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';

import { DragAndDropFileDirective } from './directives/drag-and-drop-file.directive';
import { DebounceClickDirective } from './directives/debounce-click.directive';

@NgModule({
    declarations: [
        // Pipes
        TimeAgoPipe,
        TruncatePipe,
        FillArrayPipe,

        // Directives
        DragAndDropFileDirective,
        DebounceClickDirective,

        // Components
        ReportDialogComponent,
        RoundedSelectComponent,
        ScrollToTopButtonComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        NgxMatSelectSearchModule,
        ReactiveFormsModule,
        RouterModule
    ],
    exports: [
        // Components
        RoundedSelectComponent,
        ReportDialogComponent,
        ScrollToTopButtonComponent,

        // Pipes
        TimeAgoPipe,
        FillArrayPipe,
        TruncatePipe,

        // Directives
        DragAndDropFileDirective,
        DebounceClickDirective
    ]
})
export class SharedModule { }
