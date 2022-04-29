import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatDividerModule,
        MatToolbarModule,
        MatDialogModule,
        MatInputModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatSidenavModule,
        MatChipsModule
    ],
    exports: [
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatDividerModule,
        MatToolbarModule,
        MatDialogModule,
        MatInputModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatSidenavModule,
        MatChipsModule
    ]
})
export class MaterialModule { }