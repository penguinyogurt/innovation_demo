// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtlczvZ3KNWfYu8RzMFiDeR5SS-wrL8IY",
  authDomain: "inventory-manager-d1aec.firebaseapp.com",
  projectId: "inventory-manager-d1aec",
  storageBucket: "inventory-manager-d1aec.appspot.com",
  messagingSenderId: "746000993872",
  appId: "1:746000993872:web:1dede1372c6c872d544b55",
  measurementId: "G-YSKDR9N3L2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const firestore = getFirestore(app)

export {firestore}