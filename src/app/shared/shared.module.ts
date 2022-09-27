import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from './material/material.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxDocViewerModule } from 'ngx-doc-viewer';

import { NavbarComponent } from './components/navbar/navbar.component';
import { NavigationSidenavComponent } from './components/navigation-sidenav/navigation-sidenav.component';
import { BookLoaderComponent } from './components/loaders/book-loader/book-loader.component';
import { SquareLoaderComponent } from './components/loaders/square-loader/square-loader.component';
import { ReportDialogComponent } from './components/report-dialog/report-dialog.component';
import { RoundedSelectComponent } from './components/rounded-select/rounded-select.component';

import { GetUsernamePipe } from './pipes/get-username.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { StringToArrayPipe } from './pipes/string-to-array.pipe';
import { GetDocType, GetDocName } from './pipes/posts.pipe';

import { DragAndDropFileDirective } from './directives/drag-and-drop-file.directive';

@NgModule({
    declarations: [
        // Pipes
        GetUsernamePipe,
        TimeAgoPipe,
        StringToArrayPipe,
        GetDocType,
        GetDocName,

        // Directives
        DragAndDropFileDirective,

        // Components
        ReportDialogComponent,
        NavbarComponent,
        NavigationSidenavComponent,
        BookLoaderComponent,
        SquareLoaderComponent,
        RoundedSelectComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        RouterModule,
        NgxMatSelectSearchModule,
        ReactiveFormsModule,
        NgxDocViewerModule
    ],
    exports: [
        // Components
        NavbarComponent,
        NavigationSidenavComponent,
        BookLoaderComponent,
        SquareLoaderComponent,
        RoundedSelectComponent,
        ReportDialogComponent,

        // Modules
        MaterialModule,
        NgxMatSelectSearchModule,
        ReactiveFormsModule,
        NgxDocViewerModule,

        // Pipes
        GetUsernamePipe,
        TimeAgoPipe,
        StringToArrayPipe,
        GetDocType,
        GetDocName,

        // Directives
        DragAndDropFileDirective
    ]
})
export class SharedModule { }
