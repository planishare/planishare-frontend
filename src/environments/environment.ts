// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    firebase: {
        projectId: 'planishare',
        appId: '1:175030081436:web:c74db7a4a9f1d8d5f59a59',
        storageBucket: 'planishare.appspot.com',
        locationId: 'us-central',
        apiKey: 'AIzaSyDVVvpiE2qBOd7m3wfiIxiIamq6JYF5jxM',
        authDomain: 'planishare.firebaseapp.com',
        messagingSenderId: '175030081436',
        measurementId: 'G-9KZ02B60FB'
    },
    production: false,

    apiUrl: 'https://planishare-backend-dev.azurewebsites.net/api'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
