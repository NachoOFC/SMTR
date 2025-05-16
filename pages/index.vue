<template>
  <div class="dashboard">
    <Sidebar />
    <div class="main-content">
      <Topbar />
      <AlertList :alerts="alerts" />
      <div class="filter-section">
        <h3>Activos según:</h3>
        <FilterChips :filters="filters" v-model="selectedFilter" />
        <button v-if="selectedFilter" @click="clearFilter" class="clear-filter">Limpiar filtro</button>
      </div>
      <AssetList :assets="filteredAssets" />
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
          id: 1, 
          name: 'Batería UPS', 
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
  padding: 0 2rem;
}
.filter-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.filter-section h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #555;
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
</style>
