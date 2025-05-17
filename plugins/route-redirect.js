// Plugin para redirigir desde la ruta raíz
export default defineNuxtPlugin(() => {
  addRouteMiddleware('global-redirect', (to, from) => {
    // Solo ejecutar en cliente
    if (process.client) {
      // Si estamos en la ruta raíz, redirigir según autenticación
      if (to.path === '/' || to.path === '') {
        try {
          const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
          if (isAuthenticated) {
            // Si está autenticado, ir a la página principal
            console.log('Autenticado, redirigiendo a página principal');
            return navigateTo('/principal', { replace: true });
          } else {
            // Si no está autenticado, ir al login
            console.log('No autenticado, redirigiendo a login');
            return navigateTo('/login', { replace: true });
          }
        } catch (e) {
          console.error('Error en route-redirect plugin:', e);
          return navigateTo('/login', { replace: true });
        }
      }
    }
  }, { global: true });
}); 