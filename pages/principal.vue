<template>
  <div :class="['dashboard', darkMode ? 'dark-mode' : '']">
    <Sidebar />
    <div class="main-content">
      <Topbar :darkMode="darkMode" @toggle-theme="toggleTheme" @update-search="updateSearch" />
      
      <div class="container-fluid px-md-4">
        <!-- Cards de estadísticas eliminadas -->

        <div class="row mt-4" v-if="!selectedAssetId">
          <div class="col-12">
            <div class="filter-section">
              <h3 class="filter-title">Filtrar por estado:</h3>
              <FilterChips :filters="filters" v-model="selectedFilter" />
              <button v-if="selectedFilter !== ''" @click="clearFilter" class="clear-filter btn btn-sm">
                Limpiar filtro
              </button>
            </div>
          </div>
        </div>

        <div class="row mt-3" v-if="!selectedAssetId">
          <div class="col-12">
            <StatusGraph :assets="assets" :darkMode="darkMode" />
          </div>
        </div>

        <div class="row mt-3" v-if="!selectedAssetId">
          <div class="col-12">
            <AssetList :assets="filteredAssets" :darkMode="darkMode" @select-asset="handleAssetSelection" />
          </div>
        </div>
        
        <div class="row mt-3" v-if="selectedAssetId">
           <div class="col-12">
             <AssetDetail :assetId="selectedAssetId" :darkMode="darkMode" @back="clearAssetSelection"/>
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
import AssetDetail from '~/components/AssetDetail.vue'
import StatusGraph from '~/components/StatusGraph.vue'
import { useNuxtApp } from '#app'
import { useAssets } from '~/composables/useAssets'

export default {
  components: {
    Sidebar,
    Topbar,
    AlertList,
    FilterChips,
    AssetList,
    AssetDetail,
    StatusGraph
  },

  data() {
    return {
      darkMode: false,
      filters: [
        { label: 'Todos', value: '' },
        { label: 'Crítico', value: 'critico' },
        { label: 'Precaución', value: 'precaucion' },
        { label: 'Bueno', value: 'bueno' }
      ],
      assets: [],
      selectedFilter: '',
      selectedAssetId: null,
      searchQuery: ''
    }
  },

  computed: {
    filteredAssets() {
      console.log('Selected Filter:', this.selectedFilter);
      console.log('All Assets:', this.assets);
      console.log('Search Query:', this.searchQuery);
      
      const removeAccents = (str) => {
        if (typeof str !== 'string') return '';
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      };
      
      let assetsToFilter = this.assets;

      // Apply status filter
      if (this.selectedFilter) {
        const normalizedFilter = removeAccents(this.selectedFilter?.trim().toLowerCase());
        assetsToFilter = assetsToFilter.filter(asset => {
          const normalizedAssetStatus = removeAccents(asset.status?.trim().toLowerCase());
          return normalizedAssetStatus === normalizedFilter;
        });
      }

      // Apply search filter
      if (this.searchQuery) {
        const normalizedSearchQuery = removeAccents(this.searchQuery.trim().toLowerCase());
        console.log('Normalized Search Query:', normalizedSearchQuery);
        assetsToFilter = assetsToFilter.filter(asset => {
          const normalizedAssetName = removeAccents(asset.name?.trim().toLowerCase());
         // const normalizedAssetId = removeAccents(asset.id?.trim().toLowerCase());
          
          console.log('Searching in:', { assetName: asset.name, normalizedAssetName });

          return normalizedAssetName.includes(normalizedSearchQuery)
          // ||
            // normalizedAssetId.includes(normalizedSearchQuery);
        });
      }
      
      console.log('Filtered Assets:', assetsToFilter);
      return assetsToFilter;
    },

    criticalAssetsCount() {
      return this.assets.filter(asset => 
        asset.status && asset.status.toLowerCase().includes('critico')
      ).length;
    },

    warningAssetsCount() {
      return this.assets.filter(asset => 
        asset.status && asset.status.toLowerCase().includes('precaucion')
      ).length;
    },

    goodAssetsCount() {
      return this.assets.filter(asset => 
        asset.status && asset.status.toLowerCase().includes('bueno')
      ).length;
    }
  },

  mounted() {
    if (process.client) {
      try {
        console.log('Principal.vue mounted hook started');
        
        const { $isAuthenticated } = useNuxtApp();
        console.log('Is Authenticated:', $isAuthenticated.value);
        if (!$isAuthenticated.value) {
          console.log('User not authenticated, redirecting to login');
          navigateTo('/login', { replace: true });
        }
        
        this.darkMode = localStorage.getItem('darkMode') === 'true';
        if (this.darkMode) {
          document.body.classList.add('dark-mode');
        } else {
          document.body.classList.remove('dark-mode');
        }
        
        const { fetchAssets } = useAssets();
        fetchAssets((loadedAssets) => {
          this.assets = loadedAssets;
          console.log('Datos de Firebase cargados y mapeados:', this.assets);
        });

      } catch (e) {
        console.error('Error en mounted hook:', e);
      }
    }
    console.log('Principal.vue mounted hook finished');
  },

  methods: {
    clearFilter() {
      this.selectedFilter = ''
    },
    
    toggleTheme() {
      this.darkMode = !this.darkMode;
    },

    handleAssetSelection(assetId) {
      this.selectedAssetId = assetId;
    },

    clearAssetSelection() {
      this.selectedAssetId = null;
    },

    updateSearch(query) {
      this.searchQuery = query;
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
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  transition: background-color 0.15s ease-in-out;
}

.clear-filter:hover {
  background-color: #5a6268;
}

/* Estilos para modo oscuro */
.dark-mode {
  background: #121212;
  color: #f0f0f0;
}

.dark-mode .filter-section {
  background: #272741;
  color: #f0f0f0;
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

/* Dark mode styles for search */

/* Cards de estadísticas */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--card-color), var(--card-color-light));
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-card-total {
  --card-color: #3498db;
  --card-color-light: #5dade2;
}

.stat-card-critical {
  --card-color: #e74c3c;
  --card-color-light: #ec7063;
}

.stat-card-warning {
  --card-color: #f39c12;
  --card-color-light: #f7dc6f;
}

.stat-card-good {
  --card-color: #27ae60;
  --card-color-light: #58d68d;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  background: linear-gradient(135deg, var(--card-color), var(--card-color-light));
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: #2c3e50;
  line-height: 1;
}

.stat-label {
  margin: 0.25rem 0 0 0;
  color: #7f8c8d;
  font-size: 0.9rem;
  font-weight: 500;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  background: rgba(39, 174, 96, 0.1);
  color: #27ae60;
}

.stat-trend i {
  font-size: 0.7rem;
}

/* Dark mode para cards */
.dark-mode .stat-card {
  background: #272741;
  border-color: rgba(255, 255, 255, 0.1);
}

.dark-mode .stat-number {
  color: #f0f0f0;
}

.dark-mode .stat-label {
  color: #bdc3c7;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
}
</style> 