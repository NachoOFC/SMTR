// Este es un middleware simple para simular autenticación
// hasta que se implemente el backend real

// Middleware para verificar autenticación con Firebase
<<<<<<< HEAD
import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useNuxtApp } from '#app'
import { watch } from 'vue' // Importa watch

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Accede a los estados de autenticación proporcionados por tu plugin de Firebase
  const { $isAuthenticated, $isAuthReady } = useNuxtApp().provide;

  // Si la autenticación ya está lista y el usuario no está autenticado, redirige inmediatamente.
  // Esto cubre casos donde el middleware se ejecuta después de que Firebase ya inicializó.
  if ($isAuthReady.value && !$isAuthenticated.value) {
    console.log('Middleware auth (ready): User not authenticated, redirecting to /login');
    return navigateTo('/login');
  }

  // Si la autenticación aún no está lista, espera a que lo esté.
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

    // Una vez que la autenticación está lista, verifica si el usuario está autenticado y redirige si es necesario.
    if (!$isAuthenticated.value) {
      console.log('Middleware auth (waited): User not authenticated after waiting, redirecting to /login');
      return navigateTo('/login');
    }
  }

  console.log('Middleware auth: User is authenticated (or was redirected).');
=======
export default defineNuxtRouteMiddleware((to, from) => {
  // No verificar autenticación en entorno servidor
  if (process.server) {
    // En el servidor, permitir la navegación inicial
    return;
  }
  
  const { isAuthenticated } = useNuxtApp();
  
  // Si la ruta actual no es login, verificar autenticación
  if (to.path !== '/login') {
    if (!isAuthenticated.value) {
      console.log('No autenticado, redirigiendo a login');
      return navigateTo('/login', { replace: true });
    }
  } else if (to.path === '/login') {
    if (isAuthenticated.value) {
      console.log('Usuario autenticado, redirigiendo a principal');
      return navigateTo('/principal', { replace: true });
    }
  }
>>>>>>> parent of a3667ad (bug de dashboard)
}); 