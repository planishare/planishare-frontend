import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SearchDialogComponent } from '../search-dialog/search-dialog.component';

@Component({
    selector: 'app-search-button',
    templateUrl: './search-button.component.html',
    styleUrls: ['./search-button.component.scss']
})
export class SearchButtonComponent {
    @Input() public simpleIcon = false;

    constructor(
        public dialog: MatDialog
    ) { }

    public openSearchDialog() {
        this.dialog.open(SearchDialogComponent, {
            autoFocus: false
        });
    }

}
