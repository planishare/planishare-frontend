export interface IEducation {
    id: number,
    name: string
}

export interface IInstitution {
    id: number,
    name: string,
    institution_type: IInstitutionType
}

export interface IInstitutionType {
    id: number,
    name: string
}
