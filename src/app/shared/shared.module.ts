import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MaterialModule } from './material/material.module';
import { SearchButtonComponent } from './components/search-button/search-button.component';
import { BigButtonComponent } from './components/big-button/big-button.component';
import { SearchDialogComponent } from './components/search-dialog/search-dialog.component';
import { FormsModule } from '@angular/forms';
import { NavigationSidenavComponent } from './components/navigation-sidenav/navigation-sidenav.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        NavbarComponent,
        SearchButtonComponent,
        BigButtonComponent,
        SearchDialogComponent,
        NavigationSidenavComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        RouterModule
    ],
    exports: [
        // Components
        NavbarComponent,
        NavigationSidenavComponent,

        // Modules
        MaterialModule
    ]
})
export class SharedModule { }
