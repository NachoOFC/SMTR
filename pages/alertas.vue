<template>
  <div :class="['dashboard', darkMode ? 'dark-mode' : '']">
    <Sidebar />
    <div class="main-content">
      <Topbar :darkMode="darkMode" @toggle-theme="toggleTheme" />
      <div class="container-fluid px-md-4">
        <h1 class="mb-4">Centro de Alertas</h1>
        
        <div class="alerts-container">
          <div class="alert-filters mb-4">
            <span class="filter-chip active">Todas</span>
            <span class="filter-chip">Críticas</span>
            <span class="filter-chip">Precaución</span>
            <span class="filter-chip">Resueltas</span>
          </div>
          
          <div class="alerts-list">
            <div class="alert-card critical">
              <div class="alert-header">
                <span class="alert-badge critical">Crítico</span>
                <span class="alert-time">Hace 35 min</span>
              </div>
              <div class="alert-title">Temperatura Elevada (72°C) - Tablero Principal</div>
              <div class="alert-location">Puerto Varas, Tablero de Distribución</div>
              <div class="alert-actions">
                <button class="btn-resolve">Marcar resuelta</button>
                <button class="btn-details">Ver detalles</button>
              </div>
            </div>
            
            <div class="alert-card warning">
              <div class="alert-header">
                <span class="alert-badge warning">Precaución</span>
                <span class="alert-time">Hace 1h 12min</span>
              </div>
              <div class="alert-title">Temperatura Elevada (60°C) - Tablero Principal</div>
              <div class="alert-location">Puerto Varas, Tablero de Distribución</div>
              <div class="alert-actions">
                <button class="btn-resolve">Marcar resuelta</button>
                <button class="btn-details">Ver detalles</button>
              </div>
            </div>
            
            <div class="alert-card warning">
              <div class="alert-header">
                <span class="alert-badge warning">Precaución</span>
                <span class="alert-time">Hace 2h 45min</span>
              </div>
              <div class="alert-title">Vibración anómala - Motor Portón</div>
              <div class="alert-location">Osorno, Motor Portón Elec.</div>
              <div class="alert-actions">
                <button class="btn-resolve">Marcar resuelta</button>
                <button class="btn-details">Ver detalles</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '~/components/Sidebar.vue'
import Topbar from '~/components/Topbar.vue'
import { useNuxtApp } from '#app'

export default {
  name: 'Alertas',
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
      
      // Cargar preferencia de tema oscuro
      this.darkMode = localStorage.getItem('darkMode') === 'true';
    }
  },
  
  methods: {
    toggleTheme() {
      this.darkMode = !this.darkMode;
      localStorage.setItem('darkMode', this.darkMode);
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
}

.alerts-container {
  margin-top: 1.5rem;
}

.alert-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-chip {
  background: #eee; /* Fondo claro chip */
  padding: 0.5rem 1.5rem;
  border-radius: 1.5rem;
  cursor: pointer;
  font-weight: bold;
  color: #555; /* Texto claro chip */
  transition: all 0.3s ease;
}

.filter-chip.active {
  background: #d16ba5; /* Fondo claro chip activo */
  color: white; /* Texto claro chip activo */
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alert-card {
  background: white; /* Fondo claro tarjeta */
  border-radius: 1rem;
  padding: 1.2rem 1.5rem;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.alert-card.critical {
  border-left: 4px solid #e74c3c;
}

.alert-card.warning {
  border-left: 4px solid #f1c40f;
}

.alert-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
}

.alert-badge {
  padding: 0.2rem 1rem;
  border-radius: 1rem;
  font-weight: bold;
  font-size: 0.9rem;
}

.alert-badge.critical {
  background: #e74c3c;
  color: white;
}

.alert-badge.warning {
  background: #f1c40f;
  color: #333;
}

.alert-time {
  color: #777; /* Texto claro hora */
  font-size: 0.9rem;
}

.alert-title {
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  color: #333; /* Texto claro título */
}

.alert-location {
  color: #555; /* Texto claro ubicación */
  margin-bottom: 1rem;
}

.alert-actions {
  display: flex;
  gap: 0.8rem;
  margin-top: 0.5rem;
}

.btn-resolve {
  background: #eee; /* Fondo claro botón resolver */
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  color: #333; /* Texto claro botón resolver */
  transition: background 0.2s ease;
}

.btn-details {
  background: none;
  border: 1px solid #ccc; /* Borde claro botón detalles */
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  color: #333; /* Texto claro botón detalles */
  transition: border-color 0.2s ease, color 0.2s ease;
}

.btn-details:hover {
  border-color: #999;
  color: #555;
}

/* Estilos para dark mode */
.dark-mode {
  background: #121212; /* Fondo oscuro principal */
  color: #f0f0f0; /* Texto oscuro principal */
}

.dark-mode .alert-card {
  background: #272741; /* Fondo oscuro tarjeta */
  box-shadow: 0 3px 10px rgba(0,0,0,0.2);
}

.dark-mode .filter-chip {
  background: #3a3a55; /* Fondo oscuro chip */
  color: #e0e0e0; /* Texto oscuro chip */
}

.dark-mode .alert-time {
  color: #a0a0b0; /* Texto oscuro hora */
}

.dark-mode .alert-title {
  color: #f0f0f0; /* Texto oscuro título */
}

.dark-mode .alert-location {
  color: #c0c0d0; /* Texto oscuro ubicación */
}

.dark-mode .btn-resolve {
  background: #3a3a55; /* Fondo oscuro botón resolver */
  color: #e0e0e0; /* Texto oscuro botón resolver */
}

.dark-mode .btn-details {
  border: 1px solid #3a3a55; /* Borde oscuro botón detalles */
  color: #e0e0e0; /* Texto oscuro botón detalles */
}

@media (max-width: 767.98px) {
  .main-content {
    margin-left: 0;
    margin-bottom: 60px;
  }
  
  .alerts-container {
    margin-top: 1rem;
  }

  .alert-filters {
    gap: 0.5rem;
  }
  
  .filter-chip {
    padding: 0.4rem 1rem;
    font-size: 0.9rem;
  }

  .alert-card {
    padding: 1rem;
  }

  .alert-header {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 0.5rem;
  }

  .alert-badge {
    margin-bottom: 0.5rem;
  }

  .alert-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .btn-resolve, .btn-details {
    width: 100%;
    text-align: center;
  }
}
</style> 