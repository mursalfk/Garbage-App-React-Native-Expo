import { initializeApp, getApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import ReractNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyAOVxBNGVD7zTVi8UHSmV1-LmFXyY2vDFQ",
    authDomain: "garbage-segregation-app.firebaseapp.com",
    projectId: "garbage-segregation-app",
    storageBucket: "garbage-segregation-app.appspot.com",
    messagingSenderId: "835026995251",
    appId: "1:835026995251:web:5804bce335581e48b9bb46",
    measurementId: "G-JJD0RG389R"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReractNativeAsyncStorage),
})

const db = getFirestore(app)

export { db, app, auth, getApp, getAuth };