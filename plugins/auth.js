// Plugin para manejar autenticación 
export default defineNuxtPlugin(nuxtApp => {
  // Solo ejecutar en cliente
  if (process.client) {
    // Verificamos si es la primera vez que se carga la aplicación
    // y aseguramos que no haya una sesión activa incorrecta
    const currentRoute = useRoute();
    
    // Si la ruta actual no es login, verificar autenticación
    if (currentRoute.path !== '/login') {
      try {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        
        // Si no está autenticado y no estamos en login, redirigir
        if (!isAuthenticated) {
          console.log('Plugin auth: No autenticado, redirigiendo a login');
          // Esperar a que la aplicación esté montada antes de redirigir
          setTimeout(() => {
            navigateTo('/login', { replace: true });
          }, 10);
        }
      } catch (e) {
        console.error('Error en plugin auth:', e);
      }
    }
  }
}); 