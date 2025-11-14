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


let db, auth, storage, messaging, firebaseInitializationError;

try {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize services
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
  messaging = getMessaging(app);
} catch (error) {
  firebaseInitializationError = error;
  console.error("Firebase initialization failed:", error);
}


export { db, auth, storage, messaging, firebaseInitializationError };