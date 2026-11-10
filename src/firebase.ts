import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcUmNfILV0MeiLlSgV8TaLw_2CZV_4nzM",
  authDomain: "curso-firebase-301aa.firebaseapp.com",
  projectId: "curso-firebase-301aa",
  storageBucket: "curso-firebase-301aa.firebasestorage.app",
  messagingSenderId: "769104132828",
  appId: "1:769104132828:web:dab6d4698c0ed2166b9219"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
export {db};