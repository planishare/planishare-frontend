import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MaterialModule } from './material/material.module';
import { SearchButtonComponent } from './components/search-button/search-button.component';
import { SearchDialogComponent } from './components/search-dialog/search-dialog.component';
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
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { DragAndDropFileDirective } from './directives/drag-and-drop-file.directive';
import { RoundedSelectGroupSearchComponent } from './components/rounded-select-group-search/rounded-select-group-search.component';

@NgModule({
    declarations: [
        NavbarComponent,
        SearchButtonComponent,
        SearchDialogComponent,
        NavigationSidenavComponent,
        RoundedSelectSearchComponent,
        BookLoaderComponent,
        SquareLoaderComponent,

        // Pipes
        GetUsernamePipe,
        TimeAgoPipe,
        StringToArrayPipe,
        GetDocType,
        GetDocName,

        // Directives
        DragAndDropFileDirective,
        RoundedSelectGroupSearchComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        RouterModule,
        NgxMatSelectSearchModule,
        ReactiveFormsModule,
        NgxDocViewerModule,
        NgxShimmerLoadingModule
    ],
    exports: [
        // Components
        NavbarComponent,
        NavigationSidenavComponent,
        RoundedSelectSearchComponent,
        BookLoaderComponent,
        SquareLoaderComponent,
        RoundedSelectGroupSearchComponent,

        // Modules
        MaterialModule,
        NgxMatSelectSearchModule,
        ReactiveFormsModule,
        NgxDocViewerModule,
        NgxShimmerLoadingModule,

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
