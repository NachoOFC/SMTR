// Este es un middleware simple para simular autenticación
// hasta que se implemente el backend real

// Middleware para verificar autenticación con Firebase
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
}); 