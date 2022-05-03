import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
    providedIn: 'root'
})
export class JwtService {

    private helper = new JwtHelperService();

    constructor() { }

    public getTokenExpirationDate(jwt: string): any {
        return this.helper.getTokenExpirationDate(jwt);
    }

    public isTokenExpired(jwt: string): any {
        return this.helper.isTokenExpired(jwt);
    }
}
