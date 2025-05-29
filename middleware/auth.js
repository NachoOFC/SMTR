// Este es un middleware simple para simular autenticación
// hasta que se implemente el backend real

// Middleware para verificar autenticación con Firebase
import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useNuxtApp } from '#app'
import { watch } from 'vue' // Importa watch

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Accede a los estados de autenticación proporcionados por tu plugin de Firebase
  const { $isAuthenticated, $isAuthReady } = useNuxtApp().provide;

  // Si estamos en la página de login, no necesitamos verificar autenticación
  if (to.path === '/login') {
    return;
  }

  // Si la autenticación ya está lista y el usuario no está autenticado, redirige inmediatamente
  if ($isAuthReady.value && !$isAuthenticated.value) {
    console.log('Middleware auth (ready): User not authenticated, redirecting to /login');
    return navigateTo('/login', { replace: true });
  }

  // Si la autenticación aún no está lista, espera a que lo esté
  if (!$isAuthReady.value) {
    console.log('Middleware auth (waiting): Waiting for auth to be ready.');
    await new Promise(resolve => {
      // Observa cuando isAuthReady cambia a true
      const unwatch = watch($isAuthReady, (newValue) => {
        if (newValue) {
          unwatch(); // Deja de observar una vez que esté listo
          resolve();
        }
      });
    });

    // Una vez que la autenticación está lista, verifica si el usuario está autenticado
    if (!$isAuthenticated.value) {
      console.log('Middleware auth (waited): User not authenticated after waiting, redirecting to /login');
      return navigateTo('/login', { replace: true });
    }
  }

  console.log('Middleware auth: User is authenticated (or was redirected).');
}); 