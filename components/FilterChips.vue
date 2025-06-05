<template>
  <div class="filter-chips">
    <button
      v-for="filter in filters"
      :key="filter.value"
      :class="['filter-chip', { active: modelValue === filter.value }]"
      @click="$emit('update:modelValue', filter.value)"
    >
      {{ filter.label }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'FilterChips',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    filters: {
      type: Array,
      default: () => [
        { label: 'Todos', value: '' },
        { label: 'Crítico', value: 'critico' },
        { label: 'Precaución', value: 'precaucion' },
        { label: 'Bueno', value: 'bueno' }
      ]
    }
  }
}
</script>

<style scoped>
.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-chip {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 1.5rem;
  background: #f0f0f0;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.filter-chip:hover {
  background: #e0e0e0;
}

.filter-chip.active {
  background: #1e4d92;
  color: white;
}

/* Dark mode styles */
:deep(.dark-mode) .filter-chip {
  background: #2d2d2d;
  color: #e0e0e0;
}

:deep(.dark-mode) .filter-chip:hover {
  background: #3d3d3d;
}

:deep(.dark-mode) .filter-chip.active {
  background: #3a3a90;
  color: white;
}
</style> 