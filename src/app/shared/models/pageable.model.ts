export interface IPageable<Type> {
    count: number,
    next: string,
    previous: string,
    results: Type[]
}

export class Pageable<Type> implements IPageable<Type> {
    public count: number;
    public elementsPerPage: number;
    public maxPage: number;

    public next: string;
    public previous: string;
    public results: Type[];

    constructor(pageable: IPageable<Type>, elementsPerPage: number = 10) {
        this.count = pageable.count;
        this.elementsPerPage = elementsPerPage;
        this.maxPage = pageable.count <= this.elementsPerPage ? 1 : ((pageable.count - pageable.count % this.elementsPerPage) / this.elementsPerPage) + 1;

        this.next = pageable.next;
        this.previous = pageable.previous;
        this.results = pageable.results;
    }
}
