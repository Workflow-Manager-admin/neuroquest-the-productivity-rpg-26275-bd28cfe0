// PUBLIC_INTERFACE
// Firebase configuration and initialization for NeuroQuest RPG
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-EXAMPLEvG5neuroquestblueprint", // PLACEHOLDER: Insert real keys for deployment.
  authDomain: "neuroquest-app.firebaseapp.com",
  projectId: "neuroquest-app",
  storageBucket: "neuroquest-app.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:neuroquestplaceholderid"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
