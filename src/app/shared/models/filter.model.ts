export type Filter<T> = {
    name: string,
    options: FilterOption<T>[],
    currentOption?: FilterOption<T>
};

export type FilterOption<T> = {
    text: string,
    value: T
}

export type FilterChange<T> = {
    name: string,
    option:  FilterOption<T>,
    remove: boolean
}
