// Import the functions you need from the SDKs you need
import { initializeApp, getApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import ReractNativeAsyncStorage from '@react-native-async-storage/async-storage';



// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAOVxBNGVD7zTVi8UHSmV1-LmFXyY2vDFQ",
    authDomain: "garbage-segregation-app.firebaseapp.com",
    projectId: "garbage-segregation-app",
    storageBucket: "garbage-segregation-app.appspot.com",
    messagingSenderId: "835026995251",
    appId: "1:835026995251:web:5804bce335581e48b9bb46",
    measurementId: "G-JJD0RG389R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReractNativeAsyncStorage),
})

// const auth = getAuth(app)


const db = getFirestore(app)


export { db, app, auth, getApp, getAuth };