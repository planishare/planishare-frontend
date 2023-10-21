export type RoundedSelectOption<Type> = {
    text: string;
    data: Type;
}

export type RoundedSelectGroup<Type> = {
    text: string;
    options: RoundedSelectOption<Type>[];
}
