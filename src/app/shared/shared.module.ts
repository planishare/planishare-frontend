import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../material.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { NavbarComponent } from './components/navbar/navbar.component';
import { NavigationSidenavComponent } from './components/navigation-sidenav/navigation-sidenav.component';
import { BookLoaderComponent } from './components/book-loader/book-loader.component';
import { ReportDialogComponent } from './components/report-dialog/report-dialog.component';
import { RoundedSelectComponent } from './components/rounded-select/rounded-select.component';

import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { FillArrayPipe } from './pipes/fill-array.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';

import { DragAndDropFileDirective } from './directives/drag-and-drop-file.directive';
import { DebounceClickDirective } from './directives/debounce-click.directive';

import { CommonSnackbarMsgService } from './services/common-snackbar-msg.service';
import { SidenavService } from './services/sidenav.service';
import { WindowResizeService } from './services/window-resize.service';
import { WindowScrollService } from './services/window-scroll.service';

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
        NavbarComponent,
        NavigationSidenavComponent,
        BookLoaderComponent,
        RoundedSelectComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        NgxMatSelectSearchModule,
        ReactiveFormsModule,
        RouterModule
    ],
    providers: [
        CommonSnackbarMsgService,
        SidenavService,
        WindowResizeService,
        WindowScrollService
    ],
    exports: [
        // Components
        NavbarComponent,
        NavigationSidenavComponent,
        BookLoaderComponent,
        RoundedSelectComponent,
        ReportDialogComponent,

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
