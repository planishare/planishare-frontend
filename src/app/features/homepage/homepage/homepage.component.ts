import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { option } from 'src/app/shared/types/rounded-select-search.type';
import { isMobile } from 'src/app/shared/utils';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
    public isMobile = isMobile;

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
        },
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
        },
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
        },
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
        },
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

    public ngOnInit(): void {
        this.academicLevelControl.valueChanges.subscribe(val => console.log('curso', val));
        this.subjectControl.valueChanges.subscribe(val => console.log('asignatura', val));
        this.axisControl.valueChanges.subscribe(val => console.log('eje', val));
    }

    public scroll(element: HTMLElement): void {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}
