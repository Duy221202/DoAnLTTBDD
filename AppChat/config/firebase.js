import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";
// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDPV4rIcFfH0LTRmVD1JY2VdHIaJvUQDBs",
  authDomain: "appchat-b6d1e.firebaseapp.com",
  projectId: "appchat-b6d1e",
  storageBucket: "appchat-b6d1e.appspot.com",
  messagingSenderId: "168349188203",
  appId: "1:168349188203:web:1e8eb9b75c4b720a3d712e",
  // apiKey: Constants.expoConfig.extra.apiKey,
  // authDomain: Constants.expoConfig.extra.authDomain,
  // projectId: Constants.expoConfig.extra.projectId,
  // storageBucket: Constants.expoConfig.extra.storageBucket,
  // messagingSenderId: Constants.expoConfig.extra.messagingSenderId,
  // appId: Constants.expoConfig.extra.appId,
};
// initialize firebase
initializeApp(firebaseConfig);
export const auth = getAuth();
export const firestore = getFirestore();

//import { getStorage } from "firebase/storage"
