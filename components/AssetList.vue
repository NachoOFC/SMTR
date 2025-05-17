<template>
  <div class="asset-list">
    <div class="row g-3">
      <div v-for="asset in assets" :key="asset.id" class="col-12 col-md-6 col-lg-4">
        <AssetCard :asset="asset" :darkMode="darkMode" />
      </div>
      
      <div v-if="assets.length === 0" class="col-12 text-center py-5">
        <p :class="{'text-muted': !darkMode, 'text-secondary': darkMode}">No se encontraron activos</p>
      </div>
    </div>
  </div>
</template>

<script>
import AssetCard from './AssetCard.vue'

export default {
  components: {
    AssetCard
  },

  props: {
    assets: { 
      type: Array, 
      required: true,
      default: () => []
    },
    darkMode: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      // No data por ahora
    }
  }
}
</script>

<style scoped>
.asset-list {
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .asset-list {
    margin-top: 0.5rem;
  }
}
</style> 