// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// Build dev: ng build --configuration development
// Deploy to Firebase dev: firebase deploy -P dev

export const environment = {
    firebase: {
        projectId: "planishare-dev",
        appId: "1:792556766443:web:1ef9b360cbb004e48aaaae",
        storageBucket: "planishare-dev.appspot.com",
        apiKey: "AIzaSyBmIoBovAm-IxiH_hHpdWV8YEHx4REIRVI",
        authDomain: "planishare-dev.firebaseapp.com",
        messagingSenderId: "792556766443",
        measurementId: "G-GSX34V1SMQ"
    },
    production: false,

    apiUrl: 'https://planishare-backend-dev.onrender.com/api'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
