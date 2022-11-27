export interface IEnviroment {
    firebase: IFirebaseConfiguration,
    production: boolean,
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
