<template>
  <section class="alert-list">
    <div class="alert-title">
      <span class="icon">⚠️</span> Alertas Activas
    </div>
    <div v-for="alert in alerts" :key="alert.id" class="alert-item" :class="alert.level">
      <span class="badge" :class="alert.level">{{ alert.levelText }}</span>
      {{ alert.text }}
    </div>
  </section>
</template>

<script>
export default {
  props: {
    alerts: { 
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
.alert-list {
  background: #f9edc9;
  border-radius: 1.2rem;
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
}
.alert-title {
  font-weight: bold;
  margin-bottom: 0.7rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.alert-item {
  margin: 0.3rem 0;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1rem;
}
.badge {
  border-radius: 0.7rem;
  padding: 0.1rem 0.7rem;
  font-size: 0.9rem;
  color: #fff;
  font-weight: bold;
}
.Crítico { background: #e74c3c; }
.Precaución { background: #f1c40f; color: #222; }
</style> 