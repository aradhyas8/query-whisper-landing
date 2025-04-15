// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDV6LH1voETiIvzDoyZOcziQhrVEuYhoAc",
  authDomain: "queryio-22fca.firebaseapp.com",
  projectId: "queryio-22fca",
  storageBucket: "queryio-22fca.firebasestorage.app",
  messagingSenderId: "865918635530",
  appId: "1:865918635530:web:6f8c67c04d011ef50099f3",
  measurementId: "G-ZCF1RJM2GE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);