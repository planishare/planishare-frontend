// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { IEnviroment } from "./environment.interface";

export const environment: IEnviroment = {
    production: false,
    externalService: {
        firebase: {
            projectId: "planishare-dev",
            appId: "1:792556766443:web:1ef9b360cbb004e48aaaae",
            storageBucket: "planishare-dev.appspot.com",
            apiKey: "AIzaSyBmIoBovAm-IxiH_hHpdWV8YEHx4REIRVI",
            authDomain: "planishare-dev.firebaseapp.com",
            messagingSenderId: "792556766443",
            measurementId: "G-GSX34V1SMQ"
        },
        rollbar: {
            accessToken: '722c61425c0043098adab09252c3732f',
            captureUncaught: true,
            captureUnhandledRejections: true,
            enabled: false, // Enable only to debug rollbar integration
            environment: 'dev'
        }
    },
    planishare: {
        baseUrl: 'https://planishare-backend-dev.onrender.com',
        protected: 'https://planishare-backend-dev.onrender.com/api/protected',
        protectedAnon: 'https://planishare-backend-dev.onrender.com/api/protected/a'
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
