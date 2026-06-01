import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAuth,
    RecaptchaVerifier,
    signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDBj3CJBdhF06ro2DqR3VX38lOiQUq_KLA",
    authDomain: "boletracker.firebaseapp.com",
    projectId: "boletracker",
    storageBucket: "boletracker.firebasestorage.app",
    messagingSenderId: "752724700641",
    appId: "1:752724700641:web:fee5f0bfcf311f67a9b6a0",
    measurementId: "G-RKCTDB6T69"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

window.auth = auth;
window.RecaptchaVerifier = RecaptchaVerifier;
window.signInWithPhoneNumber = signInWithPhoneNumber;
console.log("Firebase Loaded ✅");
