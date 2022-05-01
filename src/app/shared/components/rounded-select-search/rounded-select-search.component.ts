import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSelect } from '@angular/material/select';

@Component({
    selector: 'app-rounded-select-search',
    templateUrl: './rounded-select-search.component.html',
    styleUrls: ['./rounded-select-search.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RoundedSelectSearchComponent implements OnInit {
    public value = null;
    public list = [
        '1ro Básico',
        '3ro Básico',
        '4ro Básico',
        '8ro Básico',
        'Historia, geografía y ciencias sociales',
        '1ro Básico',
        '3ro Básico',
        '4ro Básico',
        '8ro Básico',
        'Historia, geografía y ciencias sociales',
        '1ro Básico',
        '3ro Básico',
        '4ro Básico',
        '8ro Básico',
        'Historia, geografía y ciencias sociales',
        '1ro Básico',
        '3ro Básico',
        '4ro Básico',
        '8ro Básico',
        'Historia, geografía y ciencias sociales',
        '1ro Básico',
        '3ro Básico',
        '4ro Básico',
        '8ro Básico',
        'Historia, geografía y ciencias sociales',
        '1ro Básico',
        '3ro Básico',
        '4ro Básico',
        '8ro Básico',
        'Historia, geografía y ciencias sociales',
        '1ro Básico',
        '3ro Básico',
        '4ro Básico',
        '8ro Básico',
        'Historia, geografía y ciencias sociales'
    ];

    constructor() { }

    public ngOnInit(): void {
        console.log();
    }

    public toggleSelect(select: MatSelect): void {
        select.toggle();
    }
}
