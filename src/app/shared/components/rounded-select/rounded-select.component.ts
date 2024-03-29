import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { FilterGroup, FilterOption } from '../../models/filter.model';

@Component({
    selector: 'app-rounded-select',
    templateUrl: './rounded-select.component.html',
    styleUrls: ['./rounded-select.component.scss']
})
export class RoundedSelectComponent implements OnInit, OnChanges {
    @Input() public label = '';
    @Input() public control!: FormControl<FilterOption<any>|undefined>;
    @Input() public options: (FilterOption<any> | FilterGroup<any>)[] = [];
    @Input() public resetOption = false;
    @Input() public search = false;
    @Input() public searchPlaceholder = 'Buscar';
    @Input() public loading: boolean = false;
    @Input() public cssClass: string[] = [];

    public filteredOptions: (FilterOption<any> | FilterGroup<any>)[] = [];
    public searchCtrl: FormControl = new FormControl();
    public hasGroups = false;

    constructor() {}

    public ngOnInit(): void {
        this.searchCtrl.valueChanges.subscribe((inputText: string) => {
            if (!!inputText) {
                if (!this.hasGroups) {
                    this.filteredOptions = this.simpleFilter(inputText, this.options as FilterOption<any>[]);
                } else {
                    this.filteredOptions = this.groupFilter(inputText, this.options as FilterGroup<any>[]);
                }
            } else {
                this.filteredOptions = this.options;
            }
        });
    }

    public ngOnChanges({ options }: SimpleChanges): void {
        if (options) {
            if (this.options.length) {
                this.filteredOptions = this.options;
                this.hasGroups = 'options' in this.options[0];
            }
        }
    }

    private simpleFilter(search: string, options: FilterOption<any>[]): FilterOption<any>[] {
        search = this.normilizeText(search);
        return options.filter(option => {
            const textNormalized = this.normilizeText(option.text);
            return textNormalized.includes(search);
        });
    }

    private groupFilter(search: string, options: FilterGroup<any>[]): FilterGroup<any>[] {
        const results: FilterGroup<any>[] = [];
        search = this.normilizeText(search);
        options.forEach(el => {
            const groupTextNormalized = this.normilizeText(el.text);
            const filteredOptions: FilterOption<any>[] = [];
            el.options.forEach(option => {
                const optionTextNormalized = this.normilizeText(option.text);
                if (optionTextNormalized.includes(search)) {
                    filteredOptions.push(option);
                }
            });

            if (groupTextNormalized.includes(search)) {
                results.push(el);
            } else if (filteredOptions.length) {
                results.push(
                    { ...el, options: filteredOptions }
                );
            }
        });
        return results;
    }

    public toggleSelect(select: MatSelect): void {
        select.toggle();
    }

    public compareValues(option: FilterOption<any>, value: FilterOption<any>|undefined): boolean {
        return option.value === value?.value;
    }

    // Utils
    private normilizeText(value: string): string {
        return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
}
