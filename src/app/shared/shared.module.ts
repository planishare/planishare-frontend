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
import { LoadingButtonDirective } from './directives/loading-button.directive';
import { PaginatedFilterStatusComponent } from './components/paginated-filter-status/paginated-filter-status.component';
import { CollapsableFiltersComponent } from './components/collapsable-filters/collapsable-filters.component';

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
        ScrollToTopButtonComponent,
        LoadingButtonDirective,
        PaginatedFilterStatusComponent,
        CollapsableFiltersComponent
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
        PaginatedFilterStatusComponent,
        CollapsableFiltersComponent,

        // Pipes
        TimeAgoPipe,
        FillArrayPipe,
        TruncatePipe,

        // Directives
        DragAndDropFileDirective,
        DebounceClickDirective,
        LoadingButtonDirective
    ]
})
export class SharedModule { }
