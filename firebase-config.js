// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhTHWF1IfXH90mgDyPMBXMr_txrouThFA",
  authDomain: "mi-app-bebe.firebaseapp.com",
  databaseURL: "https://mi-app-bebe-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mi-app-bebe",
  storageBucket: "mi-app-bebe.appspot.com",
  messagingSenderId: "304403418171",
  appId: "1:304403418171:web:3c366febcf9ed500f9a01e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Inicializa Firestore
export const db = getFirestore(app);
