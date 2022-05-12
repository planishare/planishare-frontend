import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MaterialModule } from './material/material.module';
import { SearchButtonComponent } from './components/search-button/search-button.component';
import { BigButtonComponent } from './components/big-button/big-button.component';
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

@NgModule({
    declarations: [
        NavbarComponent,
        SearchButtonComponent,
        BigButtonComponent,
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
        GetDocName
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
        GetDocName
    ]
})
export class SharedModule { }
