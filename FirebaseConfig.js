// FirebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAuk-KHk4eXTKRyuet1YxncNOXXemEUCXQ",
  authDomain: "pay-2-play.firebaseapp.com",
  projectId: "pay-2-play",
  storageBucket: "pay-2-play.appspot.com",
  messagingSenderId: "85722490699",
  appId: "1:85722490699:web:942d90f1f27dd7085b2ace",
};

// Initialize Firebase App
const firebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

// Initialize Firebase Auth with AsyncStorage for persistence
let firebaseAuth;
try {
  firebaseAuth = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  // If auth is already initialized, use the existing one
  firebaseAuth = getAuth(firebaseApp);
}
// Initialize Firestore
const firestoreDb = getFirestore(firebaseApp);

export {
  firebaseApp as FIREBASE_APP,
  firebaseAuth as FIREBASE_AUTH,
  firestoreDb as FIRESTORE_DB,
};
