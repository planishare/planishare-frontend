import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { startWith } from 'rxjs';
import { RoundedSelectSearchOption, RoundedSelectSearchGroup } from '../../types/rounded-select-search.type';

@Component({
    selector: 'app-rounded-select-group-search',
    templateUrl: './rounded-select-group-search.component.html',
    styleUrls: ['./rounded-select-group-search.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RoundedSelectGroupSearchComponent implements OnInit {
    @Input() public buttonText!: string;
    @Input() public placeholder: string = 'Buscar';
    @Input() public bgColor?: string;
    @Input() public textColor?: string;
    @Input() public control!: FormControl;
    @Input() public set list(options: RoundedSelectSearchGroup[]) {
        this._list =  options;
        this.filteredList = this._list;
    }
    @Input() public disabled: boolean = false;
    @Input() public loading: boolean = false;

    public search: FormControl;
    public _buttonText: string = '';
    public buttonStyle!: any;
    public _list!: RoundedSelectSearchGroup[];
    public filteredList!: RoundedSelectSearchGroup[];

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
            this.filteredList = this.grupFilter(value, this._list);
        });
    }

    public toggleSelect(select: MatSelect): void {
        select.toggle();
    }

    private checkInputs(): void {
        if (!!!this.control) {
            throw 'No FormControl provided in rounded-select-group-search!';
        }
        if (!!!this._list) {
            throw 'No List provided in rounded-select-group-search!';
        }
        if (!!!this.buttonText) {
            throw 'No ButtonText provided in rounded-select-group-search!';
        }
    }

    private grupFilter(
        searchValue: string,
        optionList: RoundedSelectSearchGroup[]): RoundedSelectSearchGroup[] {
        if (!!searchValue) {
            searchValue = searchValue.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const results: RoundedSelectSearchGroup[] = [];
            optionList.forEach(group => {
                const groupTextNormalized = group.groupName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                const filteredOptions: RoundedSelectSearchOption[] = [];
                group.options.forEach(option => {
                    const optionTextNormalized = option.text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    if (optionTextNormalized.includes(searchValue)) {
                        filteredOptions.push(option);
                    }
                });

                if (groupTextNormalized.includes(searchValue)) {
                    results.push(group);
                } else if (filteredOptions.length) {
                    results.push(
                        { ...group, options: filteredOptions }
                    );
                }
            });
            return results;
        } else {
            return optionList;
        }
    }
}
