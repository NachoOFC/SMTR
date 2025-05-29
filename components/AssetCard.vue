<template>
  <div class="asset-card" @click="handleClick">
    <div :class="['card h-100 shadow-sm', darkMode ? 'dark-mode' : '']">
      <div class="card-body">
        <div class="asset-header">
          <h5 class="card-title mb-0">{{ asset.name }}</h5>
          <span v-if="asset.value" class="badge asset-value" 
                :class="{'bg-danger': asset.type === 'temp', 'bg-warning text-dark': asset.type === 'vib', 'bg-success': asset.type === 'electric'}">
            {{ asset.value }}
          </span>
        </div>
        
        <div class="card-text mt-3">
          <div class="asset-info-row">
            <i class="bi bi-geo-alt-fill text-muted me-2"></i>
            <span>Sector: <strong>{{ asset.sector }}</strong></span>
          </div>
          
          <div class="asset-info-row mt-2">
            <i class="bi bi-circle-fill status-icon me-2" 
              :class="{'text-success': asset.status === 'Bueno', 
                      'text-warning': asset.status === 'Precaución',
                      'text-danger': asset.status === 'Crítico'}"></i>
            <span>Estado: <StatusBadge :status="asset.status" /></span>
          </div>
        </div>
      </div>
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
  },

  methods: {
    handleClick() {
      this.$emit('asset-clicked', this.asset.id);
    }
  }
}
</script>

<style scoped>
.asset-card {
  height: 100%; /* Para que todas las tarjetas tengan la misma altura */
  cursor: pointer;
}

.card {
  border-radius: 0.75rem;
  transition: transform 0.15s ease-in-out;
  overflow: hidden;
  background-color: #fff;
}

.card:hover {
  transform: translateY(-5px);
}

/* Dark mode */
.dark-mode {
  background-color: #272741;
  color: #f0f0f0;
  border-color: #3a3a55;
}

.dark-mode .text-muted {
  color: #a0a0b0 !important;
}

.asset-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-right: 10px;
}

.asset-value {
  white-space: nowrap;
  font-size: 0.9rem;
}

.asset-info-row {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.status-icon {
  font-size: 0.7rem;
}

@media (max-width: 768px) {
  .card-body {
    padding: 0.75rem;
  }
  
  .card-title {
    font-size: 1rem;
  }
}
</style> 