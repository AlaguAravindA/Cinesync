// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBf1c4nNOTlwEVAOYtR0tz2nBwKovPDGoE",
  authDomain: "cinesync-e5de4.firebaseapp.com",
  projectId: "cinesync-e5de4",
  storageBucket: "cinesync-e5de4.appspot.com",
  messagingSenderId: "863855443013",
  appId: "1:863855443013:web:6645d18d31cdea0a03f72c",
  measurementId: "G-NVH8CG9X2Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth= getAuth(app);