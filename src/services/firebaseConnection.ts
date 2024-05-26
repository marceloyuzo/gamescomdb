import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyArXmwveeh8UGmY9lDuD1MFeDMCjHxU_AA",
  authDomain: "gamescomdb.firebaseapp.com",
  projectId: "gamescomdb",
  storageBucket: "gamescomdb.appspot.com",
  messagingSenderId: "429657004701",
  appId: "1:429657004701:web:3de5e4fd493ddd855b1274"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export { auth, app }