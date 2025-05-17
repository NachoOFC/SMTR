// Este es un middleware simple para simular autenticación
// hasta que se implemente el backend real

export default defineNuxtRouteMiddleware((to, from) => {
  // No verificar autenticación en entorno servidor
  if (process.server) return;
  
  // Siempre verificar si hay autenticación, excepto en la página de login
  if (to.path !== '/login') {
    try {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
      
      // Si no está autenticado, redirigir a login
      if (!isAuthenticated) {
        console.log('No autenticado, redirigiendo a login');
        return navigateTo('/login', { replace: true })
      }
    } catch (e) {
      console.error('Error al verificar autenticación:', e)
      return navigateTo('/login', { replace: true })
    }
  } else if (from.path === '/' && to.path === '/login') {
    // Si vamos de la página principal al login, pero estamos autenticados,
    // no redirigir (para permitir logout manual)
    return;
  } else if (to.path === '/login') {
    try {
      // Si va a login pero ya está autenticado, redirigir a home
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
      
      if (isAuthenticated) {
        return navigateTo('/', { replace: true })
      }
    } catch (e) {
      console.error('Error al verificar autenticación:', e)
    }
  }
}) 