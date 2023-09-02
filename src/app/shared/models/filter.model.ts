export interface IFilter<Type> {
    text: string;
    id: string;
    options: IFilterOption<Type>[] | IFilterGroupOption<Type>[];
}

export interface IFilterOption<Type> {
    text: string;
    value: Type;
}

export interface IFilterGroupOption<Type> {
    text: string;
    groupOptions: IFilterOption<Type>[];
}
