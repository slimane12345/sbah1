import { db } from "./firebase/firebaseConfig.js";
import { collection, addDoc } from "firebase/firestore";

// Function to add test data to Firestore
async function addTestData() {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      name: "Hicham Slimane",
      email: "hicham@example.com",
      createdAt: new Date(),
    });
    console.log("✅ Document written with ID:", docRef.id);
  } catch (e) {
    console.error("❌ Error adding document:", e);
  }
}

// Run the function
addTestData();
