<template>
  <div :class="['dashboard', darkMode ? 'dark-mode' : '']">
    <Sidebar />
    <div class="main-content">
      <Topbar :darkMode="darkMode" @toggle-theme="toggleTheme" />
      <div class="container-fluid px-md-4">
        <h1 class="mb-4">AYUDA</h1>

        <div class="help-section">
          <h2>Acerca de este sitio</h2>
          <p>Este sitio web está diseñado para el monitoreo en tiempo real de activos, proporcionando información clave sobre su estado y rendimiento. Aquí encontrarás herramientas para visualizar el estado general de los activos, filtrar información específica y acceder a detalles.</p>
        </div>

        <div class="help-section mt-4">
          <h2>Navegación</h2>
          <p>Utiliza la barra lateral de navegación para acceder a las diferentes secciones de la aplicación:</p>
          <ul>
            <li><strong>Principal:</strong> Vista general del estado de los activos y acceso a la lista principal.</li>
            <li><strong>Activos:</strong> Gestión detallada y listado completo de todos los activos.</li>
            <li><strong>Alertas:</strong> Consulta el historial de alertas generadas.</li>
            <li><strong>Historial:</strong> Revisa eventos y registros pasados de los activos.</li>
            <li><strong>Ayuda:</strong> Esta página.</li>
          </ul>
        </div>

        <div class="help-section mt-4">
          <h2>Página Principal</h2>
          <p>En la página principal encontrarás:</p>
          <ul>
            <li><strong>Filtro de Estado:</strong> Utiliza los botones para filtrar los activos por su estado (Crítico, Precaución, Bueno).</li>
            <li><strong>Gráfico de Estado:</strong> Una representación visual del número de activos en cada estado.</li>
            <li><strong>Buscador:</strong> Busca activos específicos por su ID o nombre en la barra superior.</li>
            <li><strong>Lista de Activos:</strong> Un listado de los activos, filtrado según tus selecciones. Haz clic en un activo para ver sus detalles.</li>
          </ul>
        </div>

        <div class="help-section mt-4">
          <h2>Modo Oscuro</h2>
          <p>Puedes alternar entre el modo claro y oscuro haciendo clic en el icono de sol/luna en la esquina superior derecha.</p>
        </div>

        <div class="help-section mt-4">
          <h2>Soporte</h2>
          <p>Si necesitas asistencia adicional, por favor contacta al administrador del sistema.</p>
        </div>

      </div>
      
    </div>
  </div>
</template>

<script>
import Sidebar from "~/components/Sidebar.vue";
import Topbar from "~/components/Topbar.vue";
import { useNuxtApp } from "#app";

export default {
  components: {
    Sidebar,
    Topbar,
  },

  data() {
    return {
      darkMode: false,
    };
  },

  mounted() {
    if (process.client) {
      const { $isAuthenticated } = useNuxtApp();
      if (!$isAuthenticated.value) {
        navigateTo("/login", { replace: true });
      }

      // Cargar preferencia de tema oscuro y aplicar a body
      this.darkMode = localStorage.getItem("darkMode") === "true";
      if (this.darkMode) {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }
    }
  },

  methods: {
    toggleTheme() {
      this.darkMode = !this.darkMode;
    },
  },
};
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  background: #f7f7fb;
}

.main-content {
  flex: 1;
  margin-left: 220px;
  transition: all 0.3s ease;
}

.construction-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  text-align: center;
}

.construction-message {
  background: white;
  padding: 3rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
}

.construction-message i {
  font-size: 4rem;
  color: #1e4d92;
  margin-bottom: 1rem;
}

.construction-message h2 {
  color: #1e4d92;
  margin-bottom: 1rem;
}

/* Dark mode styles */
.dark-mode {
  background: #121212;
  color: #f0f0f0;
}

.dark-mode .construction-message {
  background: #272741;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.dark-mode .construction-message i,
.dark-mode .construction-message h2 {
  color: #4d92e0;
}

@media (max-width: 767.98px) {
  .main-content {
    margin-left: 0;
    margin-bottom: 60px;
  }

  .construction-message {
    margin: 1rem;
    padding: 2rem;
  }
}

.help-section {
  background: white; /* Fondo claro para secciones de ayuda */
  padding: 1.5rem;
  border-radius: 0.8rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  margin-bottom: 1.5rem;
}

.help-section h2 {
  color: #1e4d92; /* Color para títulos de sección en modo claro */
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.help-section p {
  color: #555; /* Color para texto de párrafo en modo claro */
  line-height: 1.6;
}

.help-section ul {
  margin-top: 1rem;
  padding-left: 1.5rem;
}

.help-section li {
  margin-bottom: 0.5rem;
  color: #555; /* Color para texto de lista en modo claro */
}

/* Dark mode styles */
.dark-mode .help-section {
  background: #272741; /* Fondo oscuro para secciones de ayuda */
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.dark-mode .help-section h2 {
  color: #4d92e0; /* Color para títulos de sección en modo oscuro */
}

.dark-mode .help-section p,
.dark-mode .help-section li {
  color: #e0e0e0; /* Color para texto de párrafo y lista en modo oscuro */
}
</style>
