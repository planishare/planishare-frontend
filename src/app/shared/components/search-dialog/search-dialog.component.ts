import { Component, OnInit } from '@angular/core';
import { isMobile } from '../../utils';

@Component({
    selector: 'app-search-dialog',
    templateUrl: './search-dialog.component.html',
    styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent implements OnInit {
    public isMobile = isMobile;

    public search: string = '';

    public academicLevel: string = '';
    public academicLevels = [
        'Primero básico',
        'Segundo básico',
        'Tercero básico',
        'Cuarto básico'
    ];

    public subject: string = '';
    public subjects = [
        'Matemática',
        'Lenguaje',
        'Historia geografía y ciencias sociales'
    ];

    public axis: string = '';
    public axises = [
        'Geometría',
        'Formación ciudadana'
    ];

    constructor() { }

    public ngOnInit(): void {
    }

}
