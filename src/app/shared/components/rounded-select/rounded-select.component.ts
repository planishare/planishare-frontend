import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RoundedSelectGroup, RoundedSelectOption } from '../../types/rounded-select.type';
import { startWith } from 'rxjs';
import { MatSelect } from '@angular/material/select';

@Component({
    selector: 'app-rounded-select',
    templateUrl: './rounded-select.component.html',
    styleUrls: ['./rounded-select.component.scss']
})
export class RoundedSelectComponent implements OnInit {
    // Base input data
    @Input() public baseText = 'Base text';
    @Input() public set formControl(value: FormControl) {
        this.checkInput(value, 'FormControl');
        this._formControl = value;
    }
    @Input() public set options(value: RoundedSelectOption[] | RoundedSelectGroup[]) {
        this.checkInput(value, 'Options');
        this._options = value;
        this.filteredOptions = value;
    }

    // Configuration
    @Input() public hasGroups = false;
    @Input() public searchInput = false;
    @Input() public placeholder = 'Buscar';
    @Input() public resetButton = false;

    // Behavior config
    @Input() public disabled: boolean = false;
    @Input() public loading: boolean = false;

    // Internal variables
    public _formControl?: FormControl;
    public _options: (RoundedSelectOption | RoundedSelectGroup)[] = [];
    public filteredOptions: (RoundedSelectOption | RoundedSelectGroup)[] = [];
    public textValue?: string;
    public search: FormControl = new FormControl();

    constructor() {}

    public ngOnInit(): void {
        this._formControl?.valueChanges.pipe(startWith(this._formControl.value))
            .subscribe((data: RoundedSelectOption) => {
                this.textValue = data?.text;
                this.filteredOptions = this._options;
            });

        this.search.valueChanges.subscribe((inputText: string) => {
            if (!!inputText) {
                if (!this.hasGroups) {
                    this.filteredOptions = this.simpleFilter(inputText, this._options as RoundedSelectOption[]);
                } else {
                    this.filteredOptions = this.groupFilter(inputText, this._options as RoundedSelectGroup[]);
                }
            } else {
                this.filteredOptions = this._options;
            }
        });
    }

    private simpleFilter(
        inputText: string, simpleOptions: RoundedSelectOption[]
    ): RoundedSelectOption[] {
        inputText = this.normilizeText(inputText);
        return simpleOptions.filter(option => {
            const textNormalized = this.normilizeText(option.text);
            return textNormalized.includes(inputText);
        });
    }

    private groupFilter(
        inputText: string, optionGroups: RoundedSelectGroup[]
    ): RoundedSelectGroup[] {
        const results: RoundedSelectGroup[] = [];
        inputText = this.normilizeText(inputText);
        optionGroups.forEach(el => {
            const groupTextNormalized = this.normilizeText(el.text);
            const filteredOptions: RoundedSelectOption[] = [];
            el.options.forEach(option => {
                const optionTextNormalized = this.normilizeText(option.text);
                if (optionTextNormalized.includes(inputText)) {
                    filteredOptions.push(option);
                }
            });

            if (groupTextNormalized.includes(inputText)) {
                results.push(el);
            } else if (filteredOptions.length) {
                results.push(
                    { ...el, options: filteredOptions }
                );
            }
        });
        return results;
    }

    private checkInput(
        value: FormControl | RoundedSelectOption[] | RoundedSelectGroup[],
        attribute: string
    ): void {
        if (!value) {
            throw `No ${attribute} provided in rounded-select!`;
        }
    }

    public toggleSelect(select: MatSelect): void {
        select.toggle();
    }

    // Utils
    private normilizeText(value: string): string {
        return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
}
