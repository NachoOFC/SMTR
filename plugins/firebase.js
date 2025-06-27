import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { defineNuxtPlugin } from "#app";
import { ref, readonly } from "vue";

let db = null;

export default defineNuxtPlugin((nuxtApp) => {
  // Variables reactivas para el estado de autenticación
  const user = ref(null);
  const isAuthenticated = ref(false);
  const isAuthReady = ref(false);
  let auth = null;

  // Solo inicializar Firebase en el cliente
  if (process.client) {
    const firebaseConfig = {
      apiKey: "AIzaSyC-UiJ-KSB3pkVa-8ZrZsxWUDho08AyEYQ",
      authDomain: "innovacionproyectos-e79cc.firebaseapp.com",
      databaseURL:
        "https://innovacionproyectos-e79cc-default-rtdb.firebaseio.com",
      projectId: "innovacionproyectos-e79cc",
      storageBucket: "innovacionproyectos-e79cc.firebasestorage.app",
      messagingSenderId: "1097049027759",
      appId: "1:1097049027759:web:accc9e1dd07fefaf45905a",
    };

    try {
      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);

      // Configurar el listener de autenticación
      onAuthStateChanged(auth, (currentUser) => {
        user.value = currentUser;
        isAuthenticated.value = !!currentUser;
        isAuthReady.value = true;

        
      });
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      isAuthReady.value = true;
    }
  } else {
    isAuthReady.value = true;
  }

  return {
    provide: {
      auth: auth,
      user: readonly(user),
      isAuthenticated: readonly(isAuthenticated),
      isAuthReady: readonly(isAuthReady),
      db
    }
  };
});

export { db };
