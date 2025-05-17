export default {
  // Otras configuraciones existentes
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    'bootstrap-icons/font/bootstrap-icons.css'
  ],
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    script: [
      { src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js' }
    ]
  },
  build: {
    // Opciones de construcción
  },
  // Agregar esta configuración para usar el layout por defecto
  router: {
    extendRoutes(routes, resolve) {
      // Excluye la página de login del layout por defecto
      routes.forEach(route => {
        if (route.path !== '/login') {
          route.meta = route.meta || {};
          route.meta.layout = 'default';
        }
      });
    }
  }
} 