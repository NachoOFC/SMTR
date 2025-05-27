<template>
  <div :class="['dashboard', darkMode ? 'dark-mode' : '']">
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
            <AssetList :assets="filteredAssets" :darkMode="darkMode" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '~/components/Sidebar.vue'
import Topbar from '~/components/Topbar.vue'
import AlertList from '~/components/AlertList.vue'
import FilterChips from '~/components/FilterChips.vue'
import AssetList from '~/components/AssetList.vue'


export default {
  components: {
    Sidebar,
    Topbar,
    AlertList,
    FilterChips,
    AssetList
  },

  data() {
    return {
      darkMode: false,
      alerts: [
        { id: 1, level: 'Crítico', levelText: 'Crítico', text: 'Temperatura Elevada (72°C) - Tablero Principal' },
        { id: 2, level: 'Precaución', levelText: 'Precaución', text: 'Temperatura Elevada (60°C) - Tablero Principal' }
      ],

      filters: [
        { label: 'Lugar', value: 'lugar' },
        { label: 'T°', value: 'temp' },
        { label: 'Electric.', value: 'electric' },
        { label: 'Vibracion', value: 'vib' }
      ],

      assets: [
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
      ],

      selectedFilter: null
    }
  },

  mounted() {
    // Verificar autenticación al cargar la página principal
    if (process.client) {
      try {
        console.log('Principal.vue mounted hook started');
        
        const { $isAuthenticated } = useNuxtApp();
        console.log('Is Authenticated:', $isAuthenticated.value);
        if (!$isAuthenticated.value) {
          // Redirigir a login si no está autenticado
          console.log('User not authenticated, redirecting to login');
          navigateTo('/login', { replace: true });
        }
        
        // Cargar preferencia de tema oscuro
        this.darkMode = localStorage.getItem('darkMode') === 'true';
        console.log('Dark mode preference:', this.darkMode);
        console.log('Alerts data:', this.alerts);
        console.log('Assets data:', this.assets);
      } catch (e) {
        console.error('Error verificando autenticación:', e);
      }
    }
    console.log('Principal.vue mounted hook finished');
  },

  computed: {
    filteredAssets() {
      if (!this.selectedFilter) {
        return this.assets
      }
      
      // Filtrar por tipo de activo
      if (this.selectedFilter === 'temp' || 
          this.selectedFilter === 'electric' || 
          this.selectedFilter === 'vib') {
        return this.assets.filter(asset => asset.type === this.selectedFilter)
      }
      
      // Filtrar por lugar (sector)
      if (this.selectedFilter === 'lugar') {
        // Agrupar por sector único para este ejemplo
        const uniqueSectors = [...new Set(this.assets.map(a => a.sector))]
        return uniqueSectors.map(sector => {
          const assetsInSector = this.assets.filter(a => a.sector === sector)
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
      
      return this.assets
    }
  },

  methods: {
    clearFilter() {
      this.selectedFilter = null
    },
    
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