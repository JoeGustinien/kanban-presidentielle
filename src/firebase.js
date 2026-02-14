import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCfasUNrGBY3kqVsnqyPWSqfkY9iT147o0",
  authDomain: "kanban-presidentielle-2027.firebaseapp.com",
  projectId: "kanban-presidentielle-2027",
  storageBucket: "kanban-presidentielle-2027.firebasestorage.app",
  messagingSenderId: "869560933317",
  appId: "1:869560933317:web:e409cccf6ec0d0f7ce09ac",
  measurementId: "G-9VQNFZYYBX"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
