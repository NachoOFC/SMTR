import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(() => {
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

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  return { app, auth };
  // You can return the app instance or other things you want to make available globally
  // return {
  //   provide: {
  //     firebaseApp: app
  //   }
  // };
});
