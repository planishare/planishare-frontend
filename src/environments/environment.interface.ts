import * as Rollbar from "rollbar";

export interface IEnviroment {
    production: boolean,
    firebase: IFirebaseConfiguration,
    rollbar: Rollbar.Configuration,
    apiUrl: string
}

export interface IFirebaseConfiguration {
    projectId: string,
    appId: string,
    storageBucket: string,
    locationId?: string,
    apiKey: string,
    authDomain: string,
    messagingSenderId: string,
    measurementId: string
}
