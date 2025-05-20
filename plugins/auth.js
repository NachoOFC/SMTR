// Plugin para manejar autenticación con Firebase
export default defineNuxtPlugin((nuxtApp) => {
  // Solo ejecutar en cliente
  if (process.client) {
    const { isAuthenticated } = useNuxtApp();
    const currentRoute = useRoute();
    
    // Si la ruta actual no es login, verificar autenticación
    if (currentRoute.path !== '/login') {
      watch(isAuthenticated, (newValue) => {
        if (!newValue) {
          console.log('Plugin auth: No autenticado, redirigiendo a login');
          navigateTo('/login', { replace: true });
        }
      }, { immediate: true });
    }
  }
}); 