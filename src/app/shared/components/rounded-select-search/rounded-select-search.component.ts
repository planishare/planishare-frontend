import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { startWith } from 'rxjs';
import { RoundedSelectSearchOption } from '../../types/rounded-select-search.type';

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
    @Input() public set list(options: RoundedSelectSearchOption[]) {
        this._list =  options;
        this.filteredList = this._list;
    }
    @Input() public disabled: boolean = false;
    @Input() public loading: boolean = false;

    public search: FormControl;
    public _buttonText: string = '';
    public buttonStyle!: any;
    public _list!: RoundedSelectSearchOption[];
    public filteredList!: RoundedSelectSearchOption[];

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

        this.control.valueChanges
            .pipe(startWith(this.control.value))
            .subscribe((value: RoundedSelectSearchOption) => {
                this._buttonText = value?.text;
                this.filteredList = this._list;
            });

        this.search.valueChanges.subscribe((value: string) => {
            if (!!value) {
                value = value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                this.filteredList = this._list.filter(el => {
                    const textNormalized = el.text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    return textNormalized.includes(value);
                });
            } else {
                this.filteredList = this._list;
            }
        });
    }

    public toggleSelect(select: MatSelect): void {
        select.toggle();
    }

    private checkInputs(): void {
        if (!!!this.control) {
            throw 'No FormControl provided in rounded-select-search!';
        }
        if (!!!this._list) {
            throw 'No List provided in rounded-select-search!';
        }
        if (!!!this.buttonText) {
            throw 'No ButtonText provided in rounded-select-search!';
        }
    }
}
