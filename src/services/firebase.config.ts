// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAvolx_iWjJjYVgi4cf9q1fgOs-_lQiE8g',
  authDomain: 'polardex-prod.firebaseapp.com',
  projectId: 'polardex-prod',
  storageBucket: 'polardex-prod.firebasestorage.app',
  messagingSenderId: '475965315646',
  appId: '1:475965315646:web:60a279d7e747c2575d4f6f',
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
export const firestore = getFirestore(firebase);
