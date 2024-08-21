// firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCuItZ5TkwrSqROnpJ2XJM-uPMivQIsAYo",
  authDomain: "gymprover-2a47f.firebaseapp.com",
  databaseURL: "https://gymprover-2a47f-default-rtdb.firebaseio.com/",
  projectId: "gymprover-2a47f",
  storageBucket: "gymprover-2a47f.appspot.com",
  messagingSenderId: "482541159483",
  appId: "1:482541159483:web:66b021cbe7e3e11219881e",
  measurementId: "G-S9MDF9VL17",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
