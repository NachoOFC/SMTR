<template>
  <div :class="['dashboard', darkMode ? 'dark-mode' : '']">
    <Sidebar />
    <div class="main-content">
      <Topbar :darkMode="darkMode" @toggle-theme="toggleTheme" />
      <div class="container-fluid px-md-4">
        <h1>Gestión de Activos</h1>
        
        <div class="actions-bar">
          <div class="filters">
            <select class="filter-select" v-model="selectedType">
              <option value="">Todos los tipos</option>
              <option value="electric">Eléctricos</option>
              <option value="temp">Temperatura</option>
              <option value="vib">Vibración</option>
              <option value="security">Seguridad</option>
            </select>
            
            <select class="filter-select" v-model="selectedLocation">
              <option value="">Todas las ubicaciones</option>
              <option value="puerto-varas">Puerto Varas</option>
              <option value="osorno">Osorno</option>
              <option value="los-muermos">Los Muermos</option>
            </select>
            
            <select class="filter-select" v-model="selectedStatus">
              <option value="">Todos los estados</option>
              <option value="bueno">Bueno</option>
              <option value="precaucion">Precaución</option>
              <option value="critico">Crítico</option>
            </select>
          </div>
          
          <button class="btn-add">
            <span>+</span> Nuevo Activo
          </button>
        </div>
        
        <div class="assets-grid">
          <div v-for="asset in filteredAssets" :key="asset.id" class="asset-card">
            <div class="asset-header">
              <span class="asset-title">{{ asset.name }}</span>
              <span :class="['asset-badge', asset.valueClass]">{{ asset.value }}</span>
            </div>
            <div class="asset-details">
              <div class="detail-item">
                <span class="detail-label">ID:</span>
                <span>{{ asset.id }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Sector:</span>
                <span>{{ asset.sector }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Tipo:</span>
                <span>{{ asset.type }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Estado:</span>
                <span :class="['status', asset.status.toLowerCase()]">{{ asset.status }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Última revisión:</span>
                <span>{{ asset.lastReview }}</span>
              </div>
            </div>
            <div class="asset-actions">
              <button class="btn-asset">Ver detalles</button>
              <button class="btn-asset">Editar</button>
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
  components: {
    Sidebar,
    Topbar
  },

  data() {
    return {
      darkMode: false,
      selectedType: '',
      selectedLocation: '',
      selectedStatus: '',
      assets: [
        {
          id: 'BAT-001',
          name: 'Batería UPS',
          value: '90%',
          valueClass: 'green',
          sector: 'Los Muermos',
          type: 'Eléctrico',
          status: 'Bueno',
          lastReview: '12/07/2023'
        },
        {
          id: 'SENS-004',
          name: 'Sensor Puerta Principal',
          value: 'Activo',
          valueClass: 'green',
          sector: 'Los Muermos',
          type: 'Seguridad',
          status: 'Bueno',
          lastReview: '14/07/2023'
        },
        {
          id: 'HUM-006',
          name: 'Sensor de Humedad',
          value: '45%',
          valueClass: 'blue',
          sector: 'Osorno',
          type: 'Ambiental',
          status: 'Bueno',
          lastReview: '08/07/2023'
        }
      ]
    }
  },

  computed: {
    filteredAssets() {
      return this.assets.filter(asset => {
        const matchesType = this.selectedType === '' || 
          asset.type.toLowerCase() === this.selectedType.toLowerCase();

        const matchesLocation = this.selectedLocation === '' || 
          asset.sector.toLowerCase() === this.selectedLocation.toLowerCase();

        const matchesStatus = this.selectedStatus === '' || 
          asset.status.toLowerCase() === this.selectedStatus.toLowerCase();

        return matchesType && matchesLocation && matchesStatus;
      });
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

.actions-bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-select {
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 0.9rem;
}

.btn-add {
  background: #1e4d92;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-add span {
  font-size: 1.2rem;
}

.assets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.asset-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
  padding: 1.2rem;
  transition: transform 0.2s;
}

.asset-card:hover {
  transform: translateY(-5px);
}

.asset-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.asset-title {
  font-weight: bold;
  font-size: 1.1rem;
}

.asset-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-weight: bold;
  font-size: 0.9rem;
  color: white;
}

.asset-badge.green {
  background: #27ae60;
}

.asset-badge.red {
  background: #e74c3c;
}

.asset-badge.yellow {
  background: #f1c40f;
  color: #333;
}

.asset-badge.blue {
  background: #3498db;
}

.asset-details {
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.detail-label {
  color: #777;
  font-weight: 500;
}

.status {
  font-weight: 600;
}

.status.good {
  color: #27ae60;
}

.status.warning {
  color: #f1c40f;
}

.status.critical {
  color: #e74c3c;
}

.asset-actions {
  display: flex;
  justify-content: space-between;
}

.btn-asset {
  flex: 1;
  margin: 0 0.25rem;
  padding: 0.5rem;
  background: #f5f5f5;
  border: none;
  border-radius: 0.4rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-asset:hover {
  background: #eaeaea;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin: 2rem 0;
}

.page-btn {
  width: 2.2rem;
  height: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  background: white;
  border-radius: 0.4rem;
  cursor: pointer;
}

.page-btn.active {
  background: #1e4d92;
  border-color: #1e4d92;
  color: white;
}

/* Estilos para modo oscuro */
.dark-mode {
  background: #121212;
  color: #f0f0f0;
}

.dark-mode input, .dark-mode select, .dark-mode button {
  background-color: #272741;
  color: #f0f0f0;
  border-color: #3a3a55;
}

.dark-mode .asset-card {
  background-color: #272741;
  box-shadow: 0 3px 10px rgba(0,0,0,0.2);
}

.dark-mode .asset-title, 
.dark-mode .detail-label {
  color: #f0f0f0;
}

.dark-mode .detail-item span:not(.detail-label):not(.status) {
  color: #c0c0d0;
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
}
</style> 