// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getStorage } from "firebase/storage";

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

// Automatically sign in anonymously to allow Firebase Storage operations
// for unauthenticated sessions (like the admin panel). This satisfies
// the default security rule `allow read, write: if request.auth != null;`.
if (!auth.currentUser) {
  signInAnonymously(auth)
    .then(() => {
      console.log("Firebase signed in anonymously.");
    })
    .catch((error) => {
      console.error("Anonymous sign-in failed:", error);
    });
}


export { db, auth, storage };