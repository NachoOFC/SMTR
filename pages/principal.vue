<template>
  <div :class="['dashboard', darkMode ? 'dark-mode' : '']">
    <Sidebar />
    <div class="main-content">
      <Topbar :darkMode="darkMode" @toggle-theme="toggleTheme" />
      
      <div class="container-fluid px-md-4">
        <div class="row mt-4" v-if="!selectedAssetId">
          <div class="col-12">
            <div class="filter-section">
              <h3 class="filter-title">Filtrar por estado:</h3>
              <FilterChips :filters="filters" v-model="selectedFilter" />
              <button v-if="selectedFilter" @click="clearFilter" class="clear-filter btn btn-sm">
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
      selectedAssetId: null
    }
  },

  computed: {
    filteredAssets() {
      console.log('Selected Filter:', this.selectedFilter);
      console.log('All Assets:', this.assets);
      
      if (!this.selectedFilter) {
        return this.assets;
      }
      
      const removeAccents = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      };
      
      const filtered = this.assets.filter(asset => {
        // Normalizar los valores para la comparación
        const normalizedAssetStatus = removeAccents(asset.status?.trim().toLowerCase());
        const normalizedFilter = removeAccents(this.selectedFilter?.trim().toLowerCase());
        
        console.log('Comparing:', {
          originalAssetStatus: asset.status,
          normalizedAssetStatus,
          originalFilter: this.selectedFilter,
          normalizedFilter,
          matches: normalizedAssetStatus === normalizedFilter
        });
        
        return normalizedAssetStatus === normalizedFilter;
      });
      
      console.log('Filtered Assets:', filtered);
      return filtered;
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