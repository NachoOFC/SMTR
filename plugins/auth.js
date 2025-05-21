// Plugin para manejar autenticación con Firebase
export default defineNuxtPlugin((nuxtApp) => {
  // Solo ejecutar en cliente
  if (process.client) {
    const { isAuthenticated } = useNuxtApp();
    const currentRoute = useRoute();
    const router = useRouter();
    
    // Interceptar navegación antes de que ocurra
    router.beforeEach((to, from, next) => {
      // Rutas que requieren autenticación (ajusta según tu aplicación)
      const authRoutes = ['/principal', '/alertas', '/historial', '/activos'];
      // Ruta de login
      const loginRoute = '/login';
      
      // Verificar si la ruta actual requiere autenticación
      const requiresAuth = authRoutes.some(route => to.path.startsWith(route));
      
      // No interferir con la página de login
      if (to.path === loginRoute) {
        return next();
      }
      
      // Verificar si el usuario está autenticado (usando localStorage como respaldo)
      const isUserAuthenticated = isAuthenticated.value || localStorage.getItem('isAuthenticated') === 'true';
      
      if (requiresAuth && !isUserAuthenticated) {
        console.log('Ruta protegida, redirigiendo a login');
        return next(loginRoute);
      }
      
      next();
    });
    
    // Mantener también el watcher para cambios en autenticación (doble seguridad)
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