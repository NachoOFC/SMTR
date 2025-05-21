<template>
  <div v-if="isLoading" class="loading-screen">
    <div class="spinner"></div>
    <p>Cargando...</p>
  </div>
  <div v-else :class="['dashboard', darkMode ? 'dark-mode' : '']">
    <Sidebar />
    <div class="main-content">
      <Topbar :darkMode="darkMode" @toggle-theme="toggleTheme" />
      <div class="container-fluid px-md-4">
        <div class="row">
          <div class="col-12">
            <AlertList :alerts="alerts" :darkMode="darkMode" class="mt-3" />
          </div>
        </div>
        
        <div class="row mt-4">
          <div class="col-12">
            <div class="filter-section">
              <h3 class="filter-title">Activos según:</h3>
              <FilterChips :filters="filters" v-model="selectedFilter" />
              <button v-if="selectedFilter" @click="clearFilter" class="clear-filter btn btn-sm">
                Limpiar filtro
              </button>
            </div>
          </div>
        </div>
        
        <div class="row mt-3">
          <div class="col-12">
            <AssetList :assets="filteredAssets" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeMount } from 'vue'

// Importar componentes (ajusta según tu estructura)
const Sidebar = defineAsyncComponent(() => import('~/components/Sidebar.vue'))
const Topbar = defineAsyncComponent(() => import('~/components/Topbar.vue'))
const AlertList = defineAsyncComponent(() => import('~/components/AlertList.vue'))
const FilterChips = defineAsyncComponent(() => import('~/components/FilterChips.vue'))
const AssetList = defineAsyncComponent(() => import('~/components/AssetList.vue'))

// Estado reactivo
const darkMode = ref(false)
const isLoading = ref(true)
const selectedFilter = ref(null)

// Datos
const alerts = ref([
  { id: 1, level: 'Crítico', levelText: 'Crítico', text: 'Temperatura Elevada (72°C) - Tablero Principal' },
  { id: 2, level: 'Precaución', levelText: 'Precaución', text: 'Temperatura Elevada (60°C) - Tablero Principal' }
])

const filters = ref([
  { label: 'Lugar', value: 'lugar' },
  { label: 'T°', value: 'temp' },
  { label: 'Electric.', value: 'electric' },
  { label: 'Vibracion', value: 'vib' }
])

const assets = ref([
  { 
    id: 10, 
    name: 'Batería Leandro', 
    value: '90%', 
    valueClass: 'badge-green', 
    sector: 'Los Muermos', 
    status: 'Bueno',
    type: 'electric'
  },
  { 
    id: 2, 
    name: 'Tablero de Distribución', 
    value: '70°C', 
    valueClass: 'asset-value temp', 
    sector: 'Puerto Varas', 
    status: 'Crítico',
    type: 'temp'
  },
  { 
    id: 3, 
    name: 'Motor Portón Elec.', 
    value: '2,9g', 
    valueClass: 'asset-value vib', 
    sector: 'Osorno', 
    status: 'Precaución',
    type: 'vib'
  },
  { 
    id: 4, 
    name: 'Sensor Puerta Principal', 
    value: 'Activo', 
    valueClass: 'badge-green', 
    sector: 'Los Muermos', 
    status: 'Bueno',
    type: 'electric'
  },
  { 
    id: 5, 
    name: 'Panel Solar', 
    value: '88%', 
    valueClass: 'badge-green', 
    sector: 'Puerto Varas', 
    status: 'Bueno',
    type: 'electric'
  }
])

// Computed
const filteredAssets = computed(() => {
  if (!selectedFilter.value) {
    return assets.value
  }
  
  // Filtrar por tipo de activo
  if (selectedFilter.value === 'temp' || 
      selectedFilter.value === 'electric' || 
      selectedFilter.value === 'vib') {
    return assets.value.filter(asset => asset.type === selectedFilter.value)
  }
  
  // Filtrar por lugar (sector)
  if (selectedFilter.value === 'lugar') {
    // Agrupar por sector único para este ejemplo
    const uniqueSectors = [...new Set(assets.value.map(a => a.sector))]
    return uniqueSectors.map(sector => {
      const assetsInSector = assets.value.filter(a => a.sector === sector)
      return {
        id: `sector-${sector}`,
        name: `Sector: ${sector}`,
        value: `${assetsInSector.length} dispositivos`,
        valueClass: 'badge-info',
        sector: sector,
        status: 'Informativo',
        type: 'lugar'
      }
    })
  }
  
  return assets.value
})

// Métodos
const clearFilter = () => {
  selectedFilter.value = null
}

const toggleTheme = () => {
  darkMode.value = !darkMode.value
  if (process.client) {
    localStorage.setItem('darkMode', darkMode.value)
  }
}

const initializeComponent = () => {
  if (process.client) {
    try {
      console.log('Principal.vue initialization started')
      
      // Cargar preferencia de tema oscuro
      darkMode.value = localStorage.getItem('darkMode') === 'true'
      console.log('Dark mode preference:', darkMode.value)
      
      // Finalizar carga con un pequeño delay para asegurar renderizado
      setTimeout(() => {
        isLoading.value = false
      }, 100)
      
    } catch (e) {
      console.error('Error initializing component:', e)
      isLoading.value = false
    }
  }
}

// Hooks del ciclo de vida
onBeforeMount(() => {
  initializeComponent()
})

onMounted(() => {
  initializeComponent()
})
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

.filter-section {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.filter-title {
  margin: 0;
  font-size: 1.1rem;
  color: #555;
  white-space: nowrap;
}

.clear-filter {
  background: #eee;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 1.2rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.clear-filter:hover {
  background: #ddd;
}

/* Estilos para modo oscuro */
.dark-mode {
  background: #121212;
  color: #f0f0f0;
}

.dark-mode .filter-section {
  background: #1e1e1e;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.dark-mode .filter-title {
  color: #e0e0e0;
}

.dark-mode .clear-filter {
  background: #333;
  color: #e0e0e0;
}

.dark-mode .clear-filter:hover {
  background: #444;
}

/* Pantalla de carga */
.loading-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background: #f7f7fb;
  color: #333;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border-left-color: #09f;
  animation: spin 1s ease infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.dark-mode .loading-screen {
  background: #121212;
  color: #f0f0f0;
}

.dark-mode .spinner {
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: #09f;
}

@media (max-width: 767.98px) {
  .main-content {
    margin-left: 0;
    margin-bottom: 60px;
  }
  
  .filter-section {
    padding: 0.7rem;
    margin-left: -0.5rem;
    margin-right: -0.5rem;
    border-radius: 0.3rem;
  }
  
  .filter-title {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    width: 100%;
  }
  
  .container-fluid {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}
</style>