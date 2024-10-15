import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAPI6SGt0ZrbtSO0VgPYAmiU6Men329Zik",
    authDomain: "learnify-ai-e9a39.firebaseapp.com",
    projectId: "learnify-ai-e9a39",
    storageBucket: "learnify-ai-e9a39.appspot.com",
    messagingSenderId: "187397680652",
    appId: "1:187397680652:web:21d93370ccf22830d68829"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

