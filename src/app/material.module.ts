import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// WARNING: Avoid use mat tooltip https://github.com/angular/components/issues/10306
// import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
    declarations: [],
    imports: [
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatDialogModule,
        MatInputModule,
        MatSelectModule,
        MatSidenavModule,
        MatSnackBarModule,
        MatMenuModule,
        MatRippleModule,
        MatProgressSpinnerModule
    ],
    exports: [
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatDialogModule,
        MatInputModule,
        MatSelectModule,
        MatSidenavModule,
        MatSnackBarModule,
        MatMenuModule,
        MatRippleModule,
        MatProgressSpinnerModule
    ],
    providers: [
        {
            provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
            useValue: {
                panelClass: 'default-dialog'
            }
        }
    ]
})
export class MaterialModule { }
