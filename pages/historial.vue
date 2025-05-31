<template>
  <div :class="['dashboard', darkMode ? 'dark-mode' : '']">
    <Sidebar />
    <div class="main-content">
      <Topbar :darkMode="darkMode" @toggle-theme="toggleTheme" />
      <div class="container-fluid px-md-4">
        <h1>Historial de Eventos</h1>
        
        <div class="history-container">
          <div class="history-filters">
            <div class="filter-group">
              <label>Fecha:</label>
              <div class="date-inputs">
                <input type="date" class="date-input" value="2023-07-01" />
                <span>hasta</span>
                <input type="date" class="date-input" value="2023-07-15" />
              </div>
            </div>
            
            <div class="filter-group">
              <label>Tipo:</label>
              <select class="select-filter">
                <option value="todos">Todos los eventos</option>
                <option value="alertas">Alertas</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="sistema">Sistema</option>
              </select>
            </div>
            
            <button class="btn-filter">Filtrar</button>
          </div>
          
          <div class="history-table">
            <table>
              
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '~/components/Sidebar.vue'
import Topbar from '~/components/Topbar.vue'

export default {
  components: {
    Sidebar,
    Topbar
  },

  data() {
    return {
      darkMode: false
    }
  },

  mounted() {
    if (process.client) {
      const { $isAuthenticated } = useNuxtApp();
      if (!$isAuthenticated.value) {
        navigateTo('/login', { replace: true });
      }
      
      // Cargar preferencia de tema oscuro y aplicar a body
      this.darkMode = localStorage.getItem('darkMode') === 'true';
      
      this.$nextTick(() => {
        if (this.darkMode) {
          document.body.classList.add('dark-mode');
        } else {
          document.body.classList.remove('dark-mode');
        }
      });
    }
  },
  
  watch: {
    darkMode(newVal) {
      if (process.client) {
        if (newVal) {
          document.body.classList.add('dark-mode');
        } else {
          document.body.classList.remove('dark-mode');
        }
        localStorage.setItem('darkMode', newVal);
      }
    }
  },
  
  methods: {
    toggleTheme(isDarkModeEnabled) {
      this.darkMode = isDarkModeEnabled;
    }
  }
}
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  background: #f7f7fb; /* Fondo claro principal */
  color: #333; /* Texto claro principal */
}

.main-content {
  flex: 1;
  margin-left: 220px;
  transition: all 0.3s ease;
}

h1 {
  color: inherit;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.history-container {
  margin-top: 1.5rem;
}

.history-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  background: white; /* Fondo claro para filtros */
  padding: 1.2rem;
  border-radius: 0.8rem;
  margin-bottom: 1.5rem;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  color: #333; /* Texto claro para filtros */
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.date-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date-input,
.select-filter {
  padding: 0.5rem;
  border: 1px solid #ddd; /* Borde claro */
  border-radius: 0.5rem;
  background: white; /* Fondo claro */
  color: #333; /* Texto claro */
  min-width: 180px;
}

.btn-filter {
  background: #1e4d92; /* Fondo claro del botón */
  color: white; /* Texto claro del botón */
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-left: auto;
}

.history-table {
  background: white; /* Fondo claro de la tabla */
  border-radius: 0.8rem;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow-x: auto;
  color: #333; /* Texto claro de la tabla */
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 1rem 0.5rem;
  border-bottom: 2px solid #eee; /* Borde claro */
  color: #555; /* Texto claro encabezado */
}

td {
  padding: 1rem 0.5rem;
  border-bottom: 1px solid #eee; /* Borde claro */
}

.tag {
  padding: 0.3rem 0.8rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.tag.critical {
  background: #ffe5e5;
  color: #d32f2f;
}

.tag.warning {
  background: #fff8e1;
  color: #f57c00;
}

.tag.system {
  background: #e3f2fd;
  color: #1976d2;
}

.tag.maintenance {
  background: #e8f5e9;
  color: #388e3c;
}

.status {
  padding: 0.25rem 0.7rem;
  border-radius: 1rem;
  font-size: 0.9rem;
}

.status.resolved {
  background: #e8f5e9;
  color: #388e3c;
}

.status.success {
  background: #e3f2fd;
  color: #1976d2;
}

.btn-details {
  padding: 0.4rem 0.8rem;
  background: #f5f5f5; /* Fondo claro del botón detalles */
  border: 1px solid #ddd; /* Borde claro del botón detalles */
  color: #333; /* Texto claro del botón detalles */
  border-radius: 0.5rem;
  cursor: pointer;
}

.pagination {
  display: none;
}

.page-btn {
  display: none;
}

/* Estilos para modo oscuro */
.dark-mode {
  background: #121212; /* Fondo oscuro principal */
  color: #f0f0f0; /* Texto oscuro principal */
}

.dark-mode .history-filters,
.dark-mode .history-table {
  background: #272741; /* Fondo oscuro para filtros y tabla */
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  color: #f0f0f0; /* Texto oscuro para filtros y tabla */
}

.dark-mode .date-input,
.dark-mode .select-filter {
  background: #1a1a2e; /* Fondo oscuro para inputs/selects */
  border-color: #3a3a55; /* Borde oscuro */
  color: #f0f0f0; /* Texto oscuro */
}

.dark-mode .btn-filter {
  background: #3a3a90; /* Fondo oscuro del botón */
  color: white; /* Texto oscuro del botón */
}

.dark-mode th {
  color: #e0e0e0; /* Texto oscuro encabezado */
  border-bottom-color: #3a3a55; /* Borde oscuro */
}

.dark-mode td {
  border-bottom-color: #3a3a55; /* Borde oscuro */
}

.dark-mode .btn-details {
  background: #1a1a2e; /* Fondo oscuro del botón detalles */
  border-color: #3a3a55; /* Borde oscuro del botón detalles */
  color: #f0f0f0; /* Texto oscuro del botón detalles */
}

.dark-mode .page-btn {
  background: #1a1a2e;
  border-color: #3a3a55;
  color: #f0f0f0;
}

.dark-mode .page-btn.active {
  background: #3a3a90;
  border-color: #3a3a90;
}

@media (max-width: 767.98px) {
  .main-content {
    margin-left: 0;
    margin-bottom: 60px;
  }
  
  .history-filters {
    padding: 1rem;
  }
  
  .filter-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .date-inputs {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .date-inputs span {
    display: none;
  }

  .date-input, .select-filter {
    width: 100%;
  }
  
  .btn-filter {
    margin-left: 0;
    width: 100%;
  }
  
  .history-table {
    padding: 0.5rem;
  }

  th, td {
    padding: 0.8rem 0.3rem;
  }

  .tag,
  .status {
    font-size: 0.8rem;
    padding: 0.2rem 0.5rem;
  }

  .btn-details {
    padding: 0.3rem 0.6rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .history-filters {
    gap: 1rem;
  }
  
  .filter-group {
    width: 100%;
  }
}
</style> 