export interface IPageable<Type> {
    count: number,
    next: string,
    previous: string,
    results: Type[]
}
