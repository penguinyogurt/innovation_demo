// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBpjOq8w0KljPgDJ4wR8DT7KTKV8LOwips",
  authDomain: "innovationchallengeapp.firebaseapp.com",
  projectId: "innovationchallengeapp",
  storageBucket: "innovationchallengeapp.firebasestorage.app",
  messagingSenderId: "83054387571",
  appId: "1:83054387571:web:6c864fe28fba652d12a506",
  measurementId: "G-LLMTPR56R6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const firestore = getFirestore(app)

export {firestore}