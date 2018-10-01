import firebase from 'firebase';

export const appName = 'adv-react-26a8b';
export const firebaseConfig = {
    apiKey: "AIzaSyAUUxzUzi9qgKaJbo8uhBokPi_ChIQbs8s",
    authDomain: `${appName}.firebaseapp.com`,
    databaseURL: `https://${appName}.firebaseio.com`,
    projectId: appName,
    storageBucket: `${appName}.appspot.com`,
    messagingSenderId: "244031009272"
};

firebase.initializeApp(firebaseConfig)