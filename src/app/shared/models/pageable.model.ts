export interface IPageable<Type> {
    count: number,
    next: string,
    previous: string,
    results: Type[]
}

export class Pageable<Type> implements IPageable<Type> {
    public count: number;
    public next: string;
    public previous: string;
    public results: Type[];

    public elementsPerPage: number;
    public maxPage: number;

    constructor(pageable: IPageable<Type>, elementsPerPage: number = 10) {
        this.count = pageable.count;
        this.next = pageable.next;
        this.previous = pageable.previous;
        this.results = pageable.results;

        this.elementsPerPage = elementsPerPage;
        this.maxPage = pageable.count <= elementsPerPage ? 1 : ((pageable.count - pageable.count % elementsPerPage) / elementsPerPage) + 1;
    }
}
