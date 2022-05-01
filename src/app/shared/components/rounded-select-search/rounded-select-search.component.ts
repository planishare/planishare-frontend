import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { option } from '../../types/rounded-select-search.type';

@Component({
    selector: 'app-rounded-select-search',
    templateUrl: './rounded-select-search.component.html',
    styleUrls: ['./rounded-select-search.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RoundedSelectSearchComponent implements OnInit {
    @Input() public buttonText!: string;
    @Input() public placeholder: string = 'Buscar';
    @Input() public bgColor?: string;
    @Input() public textColor?: string;
    @Input() public control!: FormControl;
    @Input() public list!: option[];

    public search: FormControl;
    public _buttonText: string = '';
    public buttonStyle!: any;
    public _list!: option[];

    constructor() {
        this.search = new FormControl();
    }

    public ngOnInit(): void {
        this.checkInputs();

        this._buttonText = this.buttonText;
        this.buttonStyle = {
            'background-color': this.bgColor,
            'color': this.textColor
        };

        this.control.valueChanges.subscribe((value: option) => {
            this._buttonText = value?.text;
            this._list = this.list;
        });

        this._list = this.list;
        this.search.valueChanges.subscribe((value: string) => {
            if (!!value) {
                value = value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                this._list = this.list.filter(el => {
                    const textNormalized = el.text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    return textNormalized.includes(value);
                });
            } else {
                this._list = this.list;
            }
        });
    }

    public toggleSelect(select: MatSelect): void {
        select.toggle();
    }

    public test(): void {
        console.log('elimianr');
    }

    private checkInputs(): void {
        if (!!!this.control) {
            throw 'No FormControl provided in rounded-select-search!';
        }
        if (!!!this.list) {
            throw 'No List provided in rounded-select-search!';
        }
        if (!!!this.buttonText) {
            throw 'No ButtonText provided in rounded-select-search!';
        }
    }
}
