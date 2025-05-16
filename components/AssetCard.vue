<template>
  <div class="asset-card">
    <div class="asset-header">
      <span class="asset-title">{{ asset.name }}</span>
      <span v-if="asset.value" class="asset-value" :class="asset.valueClass">{{ asset.value }}</span>
    </div>
    <div class="asset-sector">Sector: {{ asset.sector }}</div>
    <div class="asset-status">
      Estado: <StatusBadge :status="asset.status" />
    </div>
    <div class="asset-badges">
      <StatusBadge status="Bueno" />
      <StatusBadge status="Precaución" />
      <StatusBadge status="Crítico" />
    </div>
  </div>
</template>

<script>
import StatusBadge from './StatusBadge.vue'

export default {
  components: {
    StatusBadge
  },

  props: {
    asset: { 
      type: Object, 
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
.asset-card {
  border: 2px solid #e0e0e0;
  border-radius: 1.2rem;
  padding: 1.2rem 1.5rem;
  margin: 0.7rem;
  min-width: 260px;
  max-width: 320px;
  background: #fff;
  box-shadow: 0 2px 8px #0001;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.asset-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  font-weight: bold;
}
.asset-value {
  border-radius: 1rem;
  padding: 0.2rem 1rem;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
}
.asset-value.temp { background: #ff5e5e; }
.asset-value.vib { background: #ffe066; color: #222; }
.asset-sector {
  font-size: 1rem;
  color: #333;
}
.asset-status {
  margin: 0.3rem 0;
}
.asset-badges {
  margin-top: 0.5rem;
}
</style> 