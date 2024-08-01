import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";
// Firebase config
const firebaseConfig = {
  // apiKey: "AIzaSyDPV4rIcFfH0LTRmVD1JY2VdHIaJvUQDBs",
  // authDomain: "appchat-b6d1e.firebaseapp.com",
  // projectId: "appchat-b6d1e",
  // storageBucket: "appchat-b6d1e.appspot.com",
  // messagingSenderId: "168349188203",
  //appId: "1:168349188203:web:1e8eb9b75c4b720a3d712e",
  apiKey: "AIzaSyBkWISHzZFgFJEmOYwnLkmXvv10rFbGBy4",
  authDomain: "cnm22-cb484.firebaseapp.com",
  projectId: "cnm22-cb484",
  storageBucket: "cnm22-cb484.appspot.com",
  messagingSenderId: "200652113295",
  appId: "1:200652113295:web:ac3c62994e0b38c572f7fa",
};
// initialize firebase
initializeApp(firebaseConfig);
export const auth = getAuth();
export const firestore = getFirestore();

//import { getStorage } from "firebase/storage"
