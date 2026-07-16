/* =========================================================
   seeker. — configuração do Firebase
   =========================================================
   1. Crie um projeto em https://console.firebase.google.com
   2. Ative o Firestore Database (modo produção)
   3. Ative Authentication > Sign-in method > E-mail/senha
   4. Crie um usuário (esse será o login do modo desenvolvedor)
      em Authentication > Users > Add user
   5. Em Configurações do projeto > Seus apps > Web (</>) ,
      copie o objeto de config e cole abaixo, no lugar dos
      valores "SUA_..."
   ========================================================= */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLNYXs_MIO-lmHsZR6sfFndb7oGSJw_QA",
  authDomain: "seeker-8ab57.firebaseapp.com",
  projectId: "seeker-8ab57",
  storageBucket: "seeker-8ab57.firebasestorage.app",
  messagingSenderId: "278946065621",
  appId: "1:278946065621:web:7088746e5345c8556c065c",
  measurementId: "G-96XCKEJWRK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// true = ainda não editado (o site cai automaticamente no catálogo de exemplo)
export const FIREBASE_IS_CONFIGURED = firebaseConfig.apiKey !== "AIzaSyCLNYXs_MIO-lmHsZR6sfFndb7oGSJw_QA";

export const app = FIREBASE_IS_CONFIGURED ? initializeApp(firebaseConfig) : null;
export const db = FIREBASE_IS_CONFIGURED ? getFirestore(app) : null;
export const auth = FIREBASE_IS_CONFIGURED ? getAuth(app) : null;
