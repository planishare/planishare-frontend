import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { option } from '../../types/rounded-select-search.type';
import { isMobile } from '../../utils';

@Component({
    selector: 'app-search-dialog',
    templateUrl: './search-dialog.component.html',
    styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent {
    public isMobile = isMobile;

    public search: string = '';

    public exampleList: option[] = [
        {
            text: '1ro Básico',
            value: '1basico'
        },
        {
            text: 'Geometría',
            value: 'geometria'
        },
        {
            text: 'Historia, geografía y ciencias sociales',
            value: 'historia'
        }
    ];

    public academicLevelControl: FormControl;
    public subjectControl: FormControl;
    public axisControl: FormControl;

    constructor() {
        this.academicLevelControl = new FormControl();
        this.subjectControl = new FormControl();
        this.axisControl = new FormControl();
    }

}
