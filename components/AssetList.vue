<template>
  <div class="asset-list">
    <AssetCard v-for="asset in assets" :key="asset.id" :asset="asset" />
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
      required: true 
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
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 1rem;
}
</style> 