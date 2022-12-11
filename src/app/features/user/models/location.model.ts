export interface IRegionWithCommunes {
    id: number,
    name: string,
    number?: string,
    communes: ICommune[]
}

export interface ICommune  {
    id: number,
    name: string
}
