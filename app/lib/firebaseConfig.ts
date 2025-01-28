// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

/*
Secure these API keys
*/
const firebaseConfig = {
  apiKey: "AIzaSyCQkOIa7qYdprROsI4OfzANGrHdJZt0wWU",
  authDomain: "rahasak-5b8ce.firebaseapp.com",
  projectId: "rahasak-5b8ce",
  storageBucket: "rahasak-5b8ce.firebasestorage.app",
  messagingSenderId: "204998947850",
  appId: "1:204998947850:web:16784b286336537731dbf3",
  measurementId: "G-J0WE4V0XXC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app