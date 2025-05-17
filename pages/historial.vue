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
              <thead>
                <tr>
                  <th>Fecha/Hora</th>
                  <th>Tipo</th>
                  <th>Descripción</th>
                  <th>Ubicación</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>15/07/2023 14:32</td>
                  <td><span class="tag critical">Alerta</span></td>
                  <td>Temperatura Elevada (72°C)</td>
                  <td>Puerto Varas, Tablero Principal</td>
                  <td><span class="status resolved">Resuelto</span></td>
                  <td><button class="btn-details">Detalles</button></td>
                </tr>
                <tr>
                  <td>14/07/2023 10:15</td>
                  <td><span class="tag warning">Precaución</span></td>
                  <td>Temperatura Elevada (60°C)</td>
                  <td>Puerto Varas, Tablero Principal</td>
                  <td><span class="status resolved">Resuelto</span></td>
                  <td><button class="btn-details">Detalles</button></td>
                </tr>
                <tr>
                  <td>12/07/2023 08:45</td>
                  <td><span class="tag system">Sistema</span></td>
                  <td>Actualización de firmware</td>
                  <td>Sistema Central</td>
                  <td><span class="status success">Exitoso</span></td>
                  <td><button class="btn-details">Detalles</button></td>
                </tr>
                <tr>
                  <td>10/07/2023 16:20</td>
                  <td><span class="tag maintenance">Mantención</span></td>
                  <td>Limpieza de sensores</td>
                  <td>Los Muermos, Panel Solar</td>
                  <td><span class="status success">Completado</span></td>
                  <td><button class="btn-details">Detalles</button></td>
                </tr>
                <tr>
                  <td>08/07/2023 11:37</td>
                  <td><span class="tag warning">Precaución</span></td>
                  <td>Vibración anómala</td>
                  <td>Osorno, Motor Portón</td>
                  <td><span class="status resolved">Resuelto</span></td>
                  <td><button class="btn-details">Detalles</button></td>
                </tr>
                <tr>
                  <td>05/07/2023 09:12</td>
                  <td><span class="tag maintenance">Mantención</span></td>
                  <td>Reemplazo de batería</td>
                  <td>Los Muermos, UPS</td>
                  <td><span class="status success">Completado</span></td>
                  <td><button class="btn-details">Detalles</button></td>
                </tr>
              </tbody>
            </table>
            
            <div class="pagination">
              <button class="page-btn">&lt;</button>
              <button class="page-btn active">1</button>
              <button class="page-btn">2</button>
              <button class="page-btn">3</button>
              <span>...</span>
              <button class="page-btn">8</button>
              <button class="page-btn">&gt;</button>
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
    // Verificar autenticación al cargar la página
    if (process.client) {
      try {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        if (!isAuthenticated) {
          // Redirigir a login si no está autenticado
          window.location.href = '/login';
        }
        
        // Cargar preferencia de tema oscuro
        this.darkMode = localStorage.getItem('darkMode') === 'true';
      } catch (e) {
        console.error('Error verificando autenticación:', e);
        window.location.href = '/login';
      }
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
  background: #f7f7fb;
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
  background: white;
  padding: 1.2rem;
  border-radius: 0.8rem;
  margin-bottom: 1.5rem;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
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

.date-input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
}

.select-filter {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  min-width: 180px;
}

.btn-filter {
  background: #1e4d92;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-left: auto;
}

.history-table {
  background: white;
  border-radius: 0.8rem;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 1rem 0.5rem;
  border-bottom: 2px solid #eee;
  color: #555;
}

td {
  padding: 1rem 0.5rem;
  border-bottom: 1px solid #eee;
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
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  cursor: pointer;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  align-items: center;
}

.page-btn {
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  background: white;
  border-radius: 0.5rem;
  cursor: pointer;
}

.page-btn.active {
  background: #1e4d92;
  color: white;
  border-color: #1e4d92;
}

/* Estilos para modo oscuro */
.dark-mode {
  background: #121212;
  color: #f0f0f0;
}

.dark-mode .history-filters,
.dark-mode .history-table {
  background: #272741;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.dark-mode .date-input,
.dark-mode .select-filter {
  background: #1a1a2e;
  border-color: #3a3a55;
  color: #f0f0f0;
}

.dark-mode .btn-filter {
  background: #3a3a90;
}

.dark-mode th {
  color: #e0e0e0;
  border-bottom-color: #3a3a55;
}

.dark-mode td {
  border-bottom-color: #3a3a55;
}

.dark-mode .btn-details {
  background: #1a1a2e;
  border-color: #3a3a55;
  color: #f0f0f0;
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
  
  .container-fluid {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  
  .history-filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .date-inputs {
    width: 100%;
    flex-direction: column;
  }
  
  .btn-filter {
    margin-left: 0;
    width: 100%;
  }
}
</style> 