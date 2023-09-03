export interface IFilter<Type> {
    title: string,
    options: IFilterOption<Type>[];
};

export interface IFilterOption<Type> {
    text: string;
    value: Type;
    optionOf: string;
    options?: IFilterOption<Type>[];
}
