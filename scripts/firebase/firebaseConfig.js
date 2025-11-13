// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKs7QQjax0FcogazrXOeSExrDxlVlfbBE",
  authDomain: "sbah-ece2e.firebaseapp.com",
  projectId: "sbah-ece2e",
  storageBucket: "sbah-ece2e.appspot.com",
  messagingSenderId: "1018203020293",
  appId: "1:1018203020293:web:3adeab254fab74d234906c",
  measurementId: "G-VKZFW5QPN6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore, Auth & Storage
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const messaging = getMessaging(app);

// Anonymous sign-in will be handled at the component level to provide user feedback.

export { db, auth, storage, messaging };