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
import { useNuxtApp } from '#app'
import { getDatabase, ref, onValue } from "firebase/database"; // Importar módulos de Realtime Database

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

      // Datos de activos ahora inicializados como vacío
      assets: [],

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
        
        // Cargar datos de activos desde Firebase
        this.fetchAssets();

      } catch (e) {
        console.error('Error en mounted hook:', e);
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
    },

    // Método para obtener datos de Firebase
    fetchAssets() {
      const db = getDatabase();
      const assetsRef = ref(db, 'components/1/data'); // Referencia ajustada a la ubicación correcta

      onValue(assetsRef, (snapshot) => {
        const data = snapshot.val();
        const loadedAssets = [];
        
        // Transformar los datos de Firebase a la estructura esperada
        if (data) {
          for (const timestamp in data) {
            const assetData = data[timestamp];
            
            let displayValue = 'N/A';
            let assetStatus = 'Desconocido';
            let assetType = 'general';
            let valueClass = 'badge-secondary'; // Clase por defecto para el badge

            // Procesar los valores para encontrar el principal a mostrar y determinar el estado/tipo
            if (assetData.values) {
              const valuesKeys = Object.keys(assetData.values);
              if (valuesKeys.length > 0) {
                // Tomar el primer valor como valor principal a mostrar
                const firstValueKey = valuesKeys[0];
                const firstValue = assetData.values[firstValueKey];
                // Intentar añadir la unidad si está presente en el nombre de la clave
                const unitMatch = firstValueKey.match(/\((.*)\)/);
                const unit = unitMatch ? unitMatch[1] : '';
                displayValue = `${firstValue}${unit ? ' ' + unit : ''}`.trim();

                // Lógica básica para determinar estado, tipo y clase basada en valores y asset_type
                const lowerCaseKey = firstValueKey.toLowerCase();
                const lowerCaseAssetType = assetData.asset_type ? assetData.asset_type.toLowerCase() : '';

                if (lowerCaseKey.includes('temperatura') || lowerCaseKey.includes('°c') || lowerCaseAssetType.includes('temperatura')) {
                  assetType = 'temp';
                   if (parseFloat(firstValue) > 70) {
                     valueClass = 'bg-danger';
                     assetStatus = 'Crítico';
                   } else if (parseFloat(firstValue) > 60) {
                     valueClass = 'bg-warning text-dark';
                     assetStatus = 'Precaución';
                   } else {
                      valueClass = 'bg-success';
                      assetStatus = 'Bueno';
                   }
                } else if (lowerCaseKey.includes('consumo') || lowerCaseKey.includes('kwh') || lowerCaseAssetType.includes('electric') || lowerCaseAssetType.includes('eléctric')) {
                  assetType = 'electric';
                   if (parseFloat(firstValue) > 100) {
                      valueClass = 'bg-warning text-dark';
                      assetStatus = 'Precaución';
                   } else {
                      valueClass = 'bg-success';
                       assetStatus = 'Bueno';
                   }
                } else if (lowerCaseKey.includes('vibracion') || lowerCaseKey.includes('g') || lowerCaseAssetType.includes('vibracion')) {
                   assetType = 'vib';
                   if (parseFloat(firstValue) > 5) {
                       valueClass = 'bg-danger';
                       assetStatus = 'Crítico';
                   } else if (parseFloat(firstValue) > 2) {
                      valueClass = 'bg-warning text-dark';
                      assetStatus = 'Precaución';
                   } else {
                       valueClass = 'bg-success';
                       assetStatus = 'Bueno';
                   }
                } else {
                  // Si no coincide con tipos conocidos, usar un estado/clase genérico
                   if (firstValue !== null && firstValue !== undefined && firstValue !== '') {
                       valueClass = 'bg-success'; // Asumir bueno si hay algún valor y tipo desconocido
                       assetStatus = 'Bueno';
                   } else {
                       valueClass = 'badge-secondary';
                       assetStatus = 'Desconocido';
                   }
                }
              }
            }
            
            loadedAssets.push({
              id: timestamp, // Usar el timestamp como ID
              name: assetData.asset_type || 'Sin Nombre', // Usar asset_type o un valor por defecto
              value: displayValue, // El valor procesado
              valueClass: valueClass, // Clase del badge
              sector: assetData.sector_location || 'Sin Sector', // Usar sector_location o valor por defecto
              status: assetStatus, // El estado determinado
              type: assetType // El tipo determinado
            });
          }
        }

        this.assets = loadedAssets;
        console.log('Datos de Firebase cargados y mapeados:', this.assets);
      }, (error) => {
        console.error('Error al cargar datos de Firebase:', error);
      });
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