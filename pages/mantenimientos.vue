<template>
  <div :class="['dashboard', darkMode ? 'dark-mode' : '']">
    <Sidebar />
    <div class="main-content">
      <Topbar :darkMode="darkMode" @toggle-theme="toggleTheme" />
      <div class="container-fluid px-md-4">
        <h1>Mantenimientos</h1>
        <div class="row">
          <div class="col-lg-5 mb-4">
            <div class="card p-4 shadow-sm">
              <h5 class="mb-3">Nuevo Registro de Mantenimiento</h5>
              <form @submit.prevent="agregarMantenimiento">
                <div class="mb-3">
                  <label class="form-label">Tipo de Mantenimiento</label>
                  <select v-model="form.tipo" class="form-select" required>
                    <option value="">Selecciona tipo</option>
                    <option value="Preventivo">Preventivo</option>
                    <option value="Correctivo">Correctivo</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Fecha</label>
                  <input v-model="form.fecha" type="date" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Hora</label>
                  <input v-model="form.hora" type="time" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Asset ID</label>
                  <input v-model="form.assetId" type="text" class="form-control" placeholder="Ej: 2" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Técnico</label>
                  <input v-model="form.tecnico" type="text" class="form-control" placeholder="Ej: Elsa Pito" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Observaciones</label>
                  <textarea v-model="form.observaciones" class="form-control" rows="2" placeholder="Describe la intervención" required></textarea>
                </div>
                <button v-if="editando" type="button" class="btn btn-secondary w-100 mt-2" @click="resetForm">Cancelar Edición</button>
                <button type="submit" class="btn btn-success w-100" :disabled="loading">
                  {{ loading ? 'Guardando...' : 'Agregar Mantenimiento' }}
                </button>
                <div v-if="error" class="alert alert-danger mt-2">{{ error }}</div>
                <div v-if="mensaje" class="alert alert-success mt-2">{{ mensaje }}</div>
              </form>
            </div>
          </div>
          <div class="col-lg-7">
            <div class="history-table mt-2">
              <h5 class="mb-3">Registros de Mantenimiento</h5>
              <table class="table table-hover table-bordered align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Tipo</th>
                    <th>Asset ID</th>
                    <th>Técnico</th>
                    <th>Observaciones</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in mantenimientos" :key="item.id">
                    <td>{{ idx + 1 }}</td>
                    <td>{{ formatFecha(item.fecha || item.date) }}</td>
                    <td>{{ item.hora || '' }}</td>
                    <td>{{ item.tipo || item.type }}</td>
                    <td>{{ item.assetId || item.asset_id }}</td>
                    <td>{{ item.tecnico || item.technician }}</td>
                    <td>{{ item.observaciones || item.observations }}</td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary me-2" @click="editarMantenimiento(item)"><i class="bi bi-pencil"></i> Editar</button>
                      <button class="btn btn-sm btn-outline-danger" @click="eliminarMantenimiento(item.id)"><i class="bi bi-trash"></i> Eliminar</button>
                    </td>
                  </tr>
                  <tr v-if="mantenimientos.length === 0">
                    <td colspan="8" class="text-center text-muted">No hay registros aún.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '~/components/Sidebar.vue';
import Topbar from '~/components/Topbar.vue';
import { ref, onMounted } from 'vue';
import { collection, addDoc, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useNuxtApp } from '#app';

export default {
  components: { Sidebar, Topbar },
  setup() {
    const { $db } = useNuxtApp();
    const darkMode = ref(false);
    const mantenimientos = ref([]);
    const loading = ref(false);
    const error = ref('');
    const mensaje = ref('');
    const editando = ref(false);
    const editId = ref(null);
    const form = ref({
      tipo: '',
      fecha: '',
      hora: '',
      assetId: '',
      tecnico: '',
      observaciones: ''
    });

    // Cargar mantenimientos en tiempo real
    onMounted(() => {
      if (process.client && $db) {
        const q = collection($db, 'maintenance_records');
        onSnapshot(q, (snapshot) => {
          mantenimientos.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        });
      }
      darkMode.value = localStorage.getItem('darkMode') === 'true';
    });

    const resetForm = () => {
      form.value = { tipo: '', fecha: '', hora: '', assetId: '', tecnico: '', observaciones: '' };
      editando.value = false;
      editId.value = null;
    };

    const agregarMantenimiento = async () => {
      error.value = '';
      mensaje.value = '';
      loading.value = true;
      try {
        if (!$db) throw new Error('No se pudo conectar a Firestore');
        if (!form.value.tipo || !form.value.fecha || !form.value.hora || !form.value.assetId || !form.value.tecnico || !form.value.observaciones) {
          throw new Error('Todos los campos son obligatorios');
        }
        if (editando.value && editId.value) {
          // Editar registro existente
          await updateDoc(doc($db, 'maintenance_records', editId.value), {
            tipo: form.value.tipo,
            fecha: form.value.fecha,
            hora: form.value.hora,
            assetId: form.value.assetId,
            tecnico: form.value.tecnico,
            observaciones: form.value.observaciones
          });
          mensaje.value = '¡Mantenimiento actualizado!';
        } else {
          // Agregar nuevo registro
          await addDoc(collection($db, 'maintenance_records'), {
            tipo: form.value.tipo,
            fecha: form.value.fecha,
            hora: form.value.hora,
            assetId: form.value.assetId,
            tecnico: form.value.tecnico,
            observaciones: form.value.observaciones
          });
          mensaje.value = '¡Mantenimiento registrado!';
        }
        resetForm();
      } catch (err) {
        error.value = err.message || 'Error al guardar.';
      } finally {
        loading.value = false;
      }
    };

    const editarMantenimiento = (item) => {
      form.value = { ...item };
      editando.value = true;
      editId.value = item.id;
      mensaje.value = '';
      error.value = '';
    };

    const eliminarMantenimiento = async (id) => {
      if (!confirm('¿Seguro que deseas eliminar este registro?')) return;
      try {
        await deleteDoc(doc($db, 'maintenance_records', id));
        mensaje.value = 'Registro eliminado.';
        if (editId.value === id) resetForm();
      } catch (err) {
        error.value = err.message || 'Error al eliminar.';
      }
    };

    const toggleTheme = (isDark) => {
      darkMode.value = isDark;
    };

    // Formatear fecha para mostrar en tabla
    const formatFecha = (fecha) => {
      if (fecha && typeof fecha === 'object' && typeof fecha.toDate === 'function') {
        return fecha.toDate().toLocaleString();
      }
      return fecha || '';
    };

    return {
      darkMode,
      mantenimientos,
      form,
      loading,
      error,
      mensaje,
      agregarMantenimiento,
      editarMantenimiento,
      eliminarMantenimiento,
      editando,
      resetForm,
      toggleTheme,
      formatFecha
    };
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
.card {
  border-radius: 1.2rem;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
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
.btn-success {
  background-color: #27ae60;
  border: none;
}
.btn-success:hover {
  background-color: #229954;
}
.dark-mode {
  background: #121212;
  color: #f0f0f0;
}
.dark-mode .card,
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
</style> 