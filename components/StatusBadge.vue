<template>
 <span class="badge d-inline-flex align-items-center" :class="statusClass">
    {{ status }}
  
    
  </span>
</template>

<script>
export default {
  props: {
    status: { 
      type: String, 
      required: true 
    }
  },

  computed: {
    statusClass() {
      if (this.status === 'Bueno') return 'bg-success'
      if (this.status === 'Precaución') return 'bg-warning text-dark'
      if (this.status === 'Crítico') return 'bg-danger'
      if (this.status === 'Informativo') return 'bg-info text-dark'
      return 'bg-secondary'
    }
  }
}
</script>

<style scoped>
.badge {
  padding: 0.35em 0.65em;
  font-size: 0.85em;
  font-weight: 500;
  border-radius: 0.5rem;
  text-transform: none;
}
</style> 