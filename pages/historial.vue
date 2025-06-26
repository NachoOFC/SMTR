<template>
  <div :class="['dashboard', darkMode ? 'dark-mode' : '']">
    <Sidebar />
    <div class="main-content">
      <Topbar :darkMode="darkMode" @toggle-theme="toggleTheme" />
      <div class="container-fluid px-md-4">
        <h1>Historial de Alertas</h1>
        <div class="history-table mt-4">
          <table class="table table-hover table-bordered align-middle">
            <thead class="table-light">
              <tr>
                <th>#</th>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Ubicación</th>
                <th>Valor Actual</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in historial" :key="item.id">
                <td>{{ idx + 1 }}</td>
                <td>{{ new Date(item.fecha).toLocaleString() }}</td>
                <td>{{ item.levelText || item.level || 'Alerta' }}</td>
                <td>{{ item.location }}</td>
                <td>{{ item.currentValue }}</td>
                <td>
                  <span :class="['badge', item.estado === 'Resuelta' ? 'bg-success' : 'bg-warning text-dark']">
                    {{ item.estado }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-sm btn-outline-primary me-2" @click="cambiarEstado(item)">
                    <i class="bi bi-arrow-repeat"></i> Cambiar Estado
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="eliminarRegistro(idx)">
                    <i class="bi bi-trash"></i> Eliminar
                  </button>
                </td>
              </tr>
              <tr v-if="historial.length === 0">
                <td colspan="7" class="text-center text-muted">No hay registros en el historial.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '~/components/Sidebar.vue'
import Topbar from '~/components/Topbar.vue'
import { demoData } from '~/store/demoData.js';

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

  computed: {
    historial() {
      return demoData.historial;
    }
  },

  mounted() {
    if (process.client) {
      const { $isAuthenticated } = useNuxtApp();
      if (!$isAuthenticated.value) {
        navigateTo('/login', { replace: true });
      }
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
    },
    cambiarEstado(item) {
      if (item.estado === 'Pendiente') {
        item.estado = 'Resuelta';
      } else if (item.estado === 'Resuelta') {
        item.estado = 'Pendiente';
      }
    },
    eliminarRegistro(idx) {
      demoData.historial.splice(idx, 1);
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
}
.history-table {
  background: white;
  border-radius: 1.2rem;
  padding: 1.2rem;
  box-shadow: 0 4px 24px rgba(30,77,146,0.08);
  overflow-x: auto;
  color: #333;
}
.table {
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 0;
}
.table thead th {
  position: sticky;
  top: 0;
  background: linear-gradient(90deg, #1e4d92 0%, #3498db 100%);
  color: #fff;
  font-weight: 600;
  border: none;
  z-index: 2;
}
.table-hover tbody tr:hover {
  background: #eaf6ff;
  transition: background 0.2s;
}
.table-bordered > :not(caption) > * > * {
  border-width: 0 0 1px 0;
}
.table td, .table th {
  vertical-align: middle;
  border: none;
}
.badge {
  font-size: 1em;
  padding: 0.5em 1em;
  border-radius: 0.7em;
}
.btn-outline-primary, .btn-outline-danger {
  border-radius: 0.5em;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
}
.btn-outline-primary i, .btn-outline-danger i {
  font-size: 1.1em;
}
@media (max-width: 767.98px) {
  .main-content {
    margin-left: 0;
    margin-bottom: 60px;
  }
  .history-table {
    padding: 0.5rem;
  }
  h1 {
    font-size: 1.3rem;
  }
}
.dark-mode {
  background: #121212;
  color: #f0f0f0;
}
.dark-mode .history-table {
  background: #23243a;
  color: #f0f0f0;
}
.dark-mode .table {
  background: #23243a;
  color: #f0f0f0;
  border-color: #2d2e4a;
}
.dark-mode .table thead th {
  background: #2d2e4a;
  color: #fff;
  border-bottom: 1.5px solid #3a3a55;
}
.dark-mode .table td {
  background: #23243a;
  color: #f0f0f0;
  border-color: #2d2e4a;
}
.dark-mode .table-hover tbody tr:hover {
  background: #28294a;
}
.dark-mode .btn,
.dark-mode .btn-outline-primary,
.dark-mode .btn-outline-danger {
  color: #fff;
  border-color: #3a3a55;
}
.dark-mode .btn:hover {
  background: #3a3a90;
  color: #fff;
}
</style> 