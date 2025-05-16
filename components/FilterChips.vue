<template>
  <div class="filter-chips">
    <span v-for="filter in filters" :key="filter.value"
      :class="['chip', { active: modelValue === filter.value }]"
      @click="$emit('update:modelValue', filter.value)">
      {{ filter.label }}
    </span>
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
  margin: 1rem 0 1.5rem 0;
  display: flex;
  gap: 1rem;
  align-items: center;
}
.chip {
  padding: 0.4rem 1.2rem;
  border-radius: 1.2rem;
  background: #eee;
  color: #333;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s, color 0.2s;
}
.chip.active {
  background: #d16ba5;
  color: #fff;
}
</style> 