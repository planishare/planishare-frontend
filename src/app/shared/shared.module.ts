import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationSidenavComponent } from './components/navigation-sidenav/navigation-sidenav.component';
import { RouterModule } from '@angular/router';
import { RoundedSelectSearchComponent } from './components/rounded-select-search/rounded-select-search.component';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { GetUsernamePipe } from './pipes/get-username.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { StringToArrayPipe } from './pipes/string-to-array.pipe';
import { BookLoaderComponent } from './components/loaders/book-loader/book-loader.component';
import { SquareLoaderComponent } from './components/loaders/square-loader/square-loader.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { GetDocType, GetDocName } from './pipes/posts.pipe';
import { DragAndDropFileDirective } from './directives/drag-and-drop-file.directive';
import { RoundedSelectGroupSearchComponent } from './components/rounded-select-group-search/rounded-select-group-search.component';
import { ReportDialogComponent } from './components/report-dialog/report-dialog.component';
import { RoundedSelectComponent } from './components/rounded-select/rounded-select.component';

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
        RoundedSelectGroupSearchComponent,

        // Components
        ReportDialogComponent,
        NavbarComponent,
        NavigationSidenavComponent,
        RoundedSelectSearchComponent,
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
        RoundedSelectSearchComponent,
        BookLoaderComponent,
        SquareLoaderComponent,
        RoundedSelectGroupSearchComponent,
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
