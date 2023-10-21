import * as Rollbar from "rollbar";

export interface IEnviroment {
    production: boolean,
    externalService: {
        firebase: IFirebaseConfiguration,
        rollbar: Rollbar.Configuration,
    },
    planishare: {
        baseUrl: string,
        public: string,
        protected: string,
        protectedAnon: string
    }
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
