// Este es un middleware simple para simular autenticación
// hasta que se implemente el backend real

// Middleware para verificar autenticación con Firebase
import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useNuxtApp } from '#app'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Accede al estado de autenticación proporcionado por tu plugin de Firebase
  const { $isAuthenticated } = useNuxtApp().provide;

  // Verifica si el usuario no está autenticado
  // Nota: Dependiendo de cómo tu plugin de Firebase maneje el estado inicial
  // y el listener de onAuthStateChanged, puede que necesites una forma más robusta
  // de esperar a que el estado de autenticación sea determinado en la carga inicial.
  // Este middleware asume que $isAuthenticated se actualizará reactivamente.

  if (!$isAuthenticated.value) {
    console.log('Middleware auth: User not authenticated, redirecting to /login');
    return navigateTo('/login');
  }

  console.log('Middleware auth: User is authenticated.');
}); 