import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA7L8HKU454q1ThKphhFr7cZ4wEUsEwlKs",
  authDomain: "sveltefirebase-9000f.firebaseapp.com",
  projectId: "sveltefirebase-9000f",
  storageBucket: "sveltefirebase-9000f.appspot.com",
  messagingSenderId: "196981158259",
  appId: "1:196981158259:web:8b98e2551575188bc1d506"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);