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

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

// true = ainda não editado (o site cai automaticamente no catálogo de exemplo)
export const FIREBASE_IS_CONFIGURED = firebaseConfig.apiKey !== "SUA_API_KEY";

export const app = FIREBASE_IS_CONFIGURED ? initializeApp(firebaseConfig) : null;
export const db = FIREBASE_IS_CONFIGURED ? getFirestore(app) : null;
export const auth = FIREBASE_IS_CONFIGURED ? getAuth(app) : null;
