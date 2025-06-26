<template>
  <div :class="['dashboard', darkMode ? 'dark-mode' : '']">
    <Sidebar />
    <div class="main-content">
      <Topbar :darkMode="darkMode" @toggle-theme="toggleTheme" />
      <div class="container-fluid px-md-4">
        <h1>Reportes</h1>
        <div class="mb-3 text-end">
          <button class="btn btn-primary" @click="openCreateModal">Nuevo Reporte</button>
        </div>
        <div class="history-table mt-4">
          <table class="table table-hover table-bordered align-middle">
            <thead class="table-light">
              <tr>
                <th>#</th>
                <th>Fecha</th>
                <th>Asunto</th>
                <th>Descripción</th>
                <th>Alerta Relacionada</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in reportes" :key="item.id">
                <td>{{ idx + 1 }}</td>
                <td>{{ new Date(item.fecha).toLocaleString() }}</td>
                <td>{{ item.asunto }}</td>
                <td>{{ item.descripcion }}</td>
                <td>
                  <span v-if="item.alerta">
                    {{ item.alerta.levelText || item.alerta.level }} - {{ item.alerta.text }}
                  </span>
                  <span v-else class="text-muted">N/A</span>
                </td>
                <td>
                  <button class="btn btn-sm btn-outline-secondary me-2" @click="openEditModal(item)">
                    <i class="bi bi-pencil"></i> Editar
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="eliminarReporte(idx)">
                    <i class="bi bi-trash"></i> Eliminar
                  </button>
                </td>
              </tr>
              <tr v-if="reportes.length === 0">
                <td colspan="6" class="text-center text-muted">No hay reportes registrados.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Crear/Editar Reporte -->
    <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,0.5);">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editMode ? 'Editar Reporte' : 'Nuevo Reporte' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Asunto</label>
              <input v-model="form.asunto" type="text" class="form-control" placeholder="Asunto del reporte">
            </div>
            <div class="mb-3">
              <label class="form-label">Descripción</label>
              <textarea v-model="form.descripcion" class="form-control" rows="3" placeholder="Describe el reporte"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
            <button type="button" class="btn btn-primary" @click="guardarReporte" :disabled="!form.asunto || !form.descripcion">
              {{ editMode ? 'Guardar Cambios' : 'Crear Reporte' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '~/components/Sidebar.vue';
import Topbar from '~/components/Topbar.vue';
import { demoData } from '~/store/demoData.js';

export default {
  components: {
    Sidebar,
    Topbar
  },
  data() {
    return {
      darkMode: false,
      showModal: false,
      editMode: false,
      editIndex: null,
      form: {
        asunto: '',
        descripcion: ''
      }
    }
  },
  computed: {
    reportes() {
      return demoData.reportes;
    }
  },
  mounted() {
    if (process.client) {
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
  methods: {
    toggleTheme(isDarkModeEnabled) {
      this.darkMode = isDarkModeEnabled;
    },
    openCreateModal() {
      this.editMode = false;
      this.editIndex = null;
      this.form = { asunto: '', descripcion: '' };
      this.showModal = true;
    },
    openEditModal(item) {
      this.editMode = true;
      this.editIndex = this.reportes.findIndex(r => r.id === item.id);
      this.form = { asunto: item.asunto, descripcion: item.descripcion };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.editMode = false;
      this.editIndex = null;
      this.form = { asunto: '', descripcion: '' };
    },
    guardarReporte() {
      if (this.editMode && this.editIndex !== null) {
        this.reportes[this.editIndex].asunto = this.form.asunto;
        this.reportes[this.editIndex].descripcion = this.form.descripcion;
      } else {
        this.reportes.push({
          id: Date.now(),
          asunto: this.form.asunto,
          descripcion: this.form.descripcion,
          alerta: null,
          fecha: new Date().toISOString()
        });
      }
      this.closeModal();
    },
    eliminarReporte(idx) {
      this.reportes.splice(idx, 1);
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
.btn-outline-secondary, .btn-outline-danger {
  border-radius: 0.5em;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
}
.btn-outline-secondary i, .btn-outline-danger i {
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
.dark-mode .btn-outline-secondary,
.dark-mode .btn-outline-danger,
.dark-mode .btn-outline-success {
  color: #fff;
  border-color: #3a3a55;
}
.dark-mode .btn:hover {
  background: #3a3a90;
  color: #fff;
}
</style> 