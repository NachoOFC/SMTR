<template>
  <div :class="['dashboard', darkMode ? 'dark-mode' : '']">
    <Sidebar />
    <div class="main-content">
      <Topbar :darkMode="darkMode" @toggle-theme="toggleTheme" />
      <div class="container-fluid px-md-4">
       <h1 class="mb-4 text-2xl font-bold tracking-wide text-[#1e4d92] dark:text-[#4d92e0] flex items-center gap-2">
        🛠️ Centro de Ayuda
      </h1>


        <div class="help-section">
          <h2>ℹ️ Acerca de este sitio</h2>
          <p>Este sistema web está diseñado para el monitoreo y gestión de activos en tiempo real. Permite supervisar el estado, rendimiento e historial de cada activo, así como generar alertas, reportes y solicitudes técnicas según el perfil de usuario.</p>
        </div>

        <div class="help-section mt-4">
          <h2>🧭 Navegación</h2>
          <p>Utiliza la barra lateral para moverte entre las distintas secciones del sistema. Las opciones disponibles pueden variar según tu perfil (usuario o técnico).</p>

          <h3 class="mt-3">🔹 Usuario</h3>
          <ul>
            <li><strong>Principal:</strong> Vista general del estado de todos los activos.</li>
            <li><strong>Activos:</strong> Consulta y gestión del inventario de activos disponibles.</li>
            <li><strong>Alertas:</strong> Historial de eventos o condiciones críticas detectadas.</li>
            <li><strong>Gráficos:</strong> Visualización de datos operativos y de rendimiento.</li>
            <li><strong>Historial:</strong> Registro cronológico de eventos asociados a los activos.</li>
            <li><strong>Reportes:</strong> Generación y descarga de informes del sistema.</li>
            <li><strong>Ayuda:</strong> Acceso a esta sección de asistencia.</li>
          </ul>

          <h3 class="mt-3">🔧 Técnico</h3>
          <ul>
            <li><strong>Principal:</strong> Panel con indicadores clave del estado técnico de los activos.</li>
            <li><strong>Activos:</strong> Gestión avanzada de características, mantenimiento y configuración.</li>
            <li><strong>Alertas:</strong> Supervisión técnica de condiciones de riesgo o fallos detectados.</li>
            <li><strong>Gráficos:</strong> Análisis visual detallado de datos técnicos y operativos.</li>
            <li><strong>Historial:</strong> Seguimiento completo de cambios, alertas y eventos.</li>
            <li><strong>Reportes:</strong> Acceso a reportes técnicos para toma de decisiones.</li>
            <li><strong>Solicitudes:</strong> Administración de solicitudes de mantenimiento u otras acciones técnicas.</li>
            <li><strong>Ayuda:</strong> Esta misma sección de soporte.</li>
          </ul>
        </div>

        <div class="help-section mt-4">
          <h2>📊 Página Principal</h2>
          <p>La página principal ofrece una visión rápida del estado actual de los activos, permitiendo un acceso directo a los elementos más relevantes.</p>

          <h3 class="mt-3">🔹 Usuario</h3>
          <ul>
            <li><strong>Filtro de Estado:</strong> Permite visualizar activos en estado Crítico, Precaución o Bueno.</li>
            <li><strong>Gráfico de Estado:</strong> Representación visual de la cantidad de activos en cada categoría.</li>
            <li><strong>Buscador:</strong> Localiza activos por nombre o código desde la barra superior.</li>
            <li><strong>Lista de Activos:</strong> Muestra los activos filtrados con acceso directo a sus detalles.</li>
          </ul>

          <h3 class="mt-3">🔧 Técnico</h3>
          <ul>
            <li><strong>Filtro de Estado:</strong> Igual que el usuario, pero enfocado a priorizar acciones técnicas.</li>
            <li><strong>Gráfico de Estado:</strong> Herramienta clave para evaluar el estado general del sistema.</li>
            <li><strong>Buscador:</strong> Permite buscar activos por parámetros técnicos o ID específicos.</li>
            <li><strong>Lista de Activos:</strong> Acceso rápido a información detallada y funciones de mantenimiento.</li>
          </ul>
        </div>

        <div class="help-section mt-4">
          <h2>🌓 Modo Oscuro</h2>
          <p>Puedes cambiar entre modo claro y oscuro utilizando el ícono del sol/luna ubicado en la esquina superior derecha. El sistema recordará tu preferencia para futuras visitas.</p>
        </div>

        <div class="help-section mt-4">
          <h2>🆘 Soporte</h2>
          <p>Si necesitas ayuda adicional o presentas problemas técnicos, contacta al administrador del sistema o al equipo de soporte según corresponda.</p>
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
