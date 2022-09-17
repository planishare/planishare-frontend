// Build prod: ng build
// Deploy to Firebase prod: firebase deploy -P prod

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
    production: true,

    apiUrl: 'https://planishare-backend.azurewebsites.net/api'
};
