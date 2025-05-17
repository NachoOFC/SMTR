<template>
  <div class="filter-chips">
    <div class="d-flex flex-wrap gap-2">
      <button 
        v-for="filter in filters" 
        :key="filter.value"
        type="button"
        :class="['btn btn-sm', { 
          'btn-primary': modelValue === filter.value, 
          'btn-outline-secondary': modelValue !== filter.value
        }]"
        @click="$emit('update:modelValue', filter.value)">
        <i v-if="filter.value === 'temp'" class="bi bi-thermometer-high me-1"></i>
        <i v-else-if="filter.value === 'electric'" class="bi bi-lightning-charge me-1"></i>
        <i v-else-if="filter.value === 'vib'" class="bi bi-arrow-repeat me-1"></i>
        <i v-else-if="filter.value === 'lugar'" class="bi bi-geo-alt me-1"></i>
        {{ filter.label }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    filters: { 
      type: Array, 
      required: true 
    },
    modelValue: { 
      type: [String, null], 
      default: null 
    }
  },

  data() {
    return {
      // No data por ahora
    }
  },

  emits: ['update:modelValue']
}
</script>

<style scoped>
.filter-chips {
  margin: 0.5rem 0;
}

.btn {
  border-radius: 1.5rem;
  padding: 0.3rem 1rem;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #1e4d92;
  border-color: #1e4d92;
}

.btn-primary:hover, .btn-primary:focus {
  background-color: #163a6f;
  border-color: #163a6f;
}

@media (max-width: 768px) {
  .filter-chips {
    width: 100%;
  }
}
</style> 