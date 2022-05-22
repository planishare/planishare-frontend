export type RegionWithCommunes = {
    id: number,
    name: string,
    number?: string,
    communes: Commune[]
}

export type Commune = {
    id: number,
    name: string
}
