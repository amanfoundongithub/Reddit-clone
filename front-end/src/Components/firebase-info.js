// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from 'firebase/auth' 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDzoZA91a60MbhR2IA5fe-esDMlsBhEz2o",
  authDomain: "greddit-login.firebaseapp.com",
  projectId: "greddit-login",
  storageBucket: "greddit-login.appspot.com",
  messagingSenderId: "1063427029153",
  appId: "1:1063427029153:web:19b9b75bfa9e060213d8e0",
  measurementId: "G-QLH1KF4L9Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app) 

export const provider = new GoogleAuthProvider() 







