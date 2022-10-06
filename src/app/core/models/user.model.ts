export interface IUserSimpleDetail {
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    education: Education,
    institution: Institution
}

export class UserSimpleDetail {
    public id: number;
    public email: string;
    public firstName: string;
    public lastName: string;
    public fullName: string;
    public education: Education;
    public institution: Institution;

    constructor (user: IUserSimpleDetail) {
        this.id = user.id;
        this.email = user.email;
        this.firstName = user.first_name;
        this.lastName = user.last_name;
        this.fullName = `${user.first_name} ${user.last_name}`;
        this.education = user.education;
        this.institution = user.institution;
    }
}

export interface Education {
    id: number,
    name: string
}

export interface Institution {
    id: number,
    name: string,
    institution_type: InstitutionType
}

export interface InstitutionType {
    id: number,
    name: string
}
