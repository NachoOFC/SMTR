import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { defineNuxtPlugin } from "#app";
import { ref, readonly } from "vue";

export default defineNuxtPlugin((nuxtApp) => {
  // Variables reactivas para el estado de autenticación
  const user = ref(null);
  const isAuthenticated = ref(false);
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

      // Configurar el listener de autenticación
      onAuthStateChanged(auth, (currentUser) => {
        user.value = currentUser;
        isAuthenticated.value = !!currentUser;
      });
    } catch (error) {
      console.error('Error initializing Firebase:', error);
    }
  }

  return {
    provide: {
      auth: auth,
      user: readonly(user),
      isAuthenticated: readonly(isAuthenticated)
    }
  };
});
