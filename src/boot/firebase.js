import { boot } from "quasar/wrappers";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { updateDoc, serverTimestamp } from "firebase/firestore";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCuJhliBvZxf-FNkMoZjuiIphUN5cXkEXs",
  authDomain: "chat-fire-edb4e.firebaseapp.com",
  projectId: "chat-fire-edb4e",
  storageBucket: "chat-fire-edb4e.appspot.com",
  messagingSenderId: "379737178665",
  appId: "1:379737178665:web:5a867be3d51e53c7f8d238",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

const marcaTiempo = serverTimestamp();
export { db, auth, marcaTiempo };
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  // something to do
});
