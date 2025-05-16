<template>
  <span :class="['status-badge', statusClass]">{{ status }}</span>
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
      if (this.status === 'Bueno') return 'badge-green'
      if (this.status === 'Precaución') return 'badge-yellow'
      if (this.status === 'Crítico') return 'badge-red'
      return ''
    }
  }
}
</script>

<style scoped>
.status-badge {
  border-radius: 1rem;
  padding: 0.2rem 1rem;
  font-size: 1rem;
  font-weight: bold;
  margin-right: 0.5rem;
  display: inline-block;
}
.badge-green { background: #6fdc6f; color: #222; }
.badge-yellow { background: #ffe066; color: #222; }
.badge-red { background: #ff5e5e; color: #fff; }
</style> 