<template>
  <section :class="['alert-list', darkMode ? 'dark-mode' : '']">
    <div class="alert-header">
      <div class="alert-title">
        <i class="bi bi-exclamation-triangle-fill me-2"></i> Alertas Activas
      </div>
      <span class="badge bg-secondary">{{ alerts.length }}</span>
    </div>
    
    <div class="alert-container">
      <div v-for="alert in alerts" :key="alert.id" 
           class="alert-item mb-2 p-2" 
           :class="{'border-danger': alert.level === 'Crítico', 'border-warning': alert.level === 'Precaución'}">
        <div class="d-flex align-items-center">
          <span class="badge me-2" 
                :class="{'bg-danger': alert.level === 'Crítico', 'bg-warning text-dark': alert.level === 'Precaución'}">
            {{ alert.levelText }}
          </span>
          <span class="alert-text">{{ alert.text }}</span>
        </div>
      </div>
      
      <div v-if="alerts.length === 0" class="text-center py-3 text-muted">
        No hay alertas activas
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    alerts: { 
      type: Array, 
      required: true,
      default: () => []
    },
    darkMode: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.alert-list {
  background: #f9edc9;
  border-radius: 1rem;
  padding: 1rem;
  margin: 1rem 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* Dark mode */
.dark-mode {
  background: #2d2724;
  color: #f0f0f0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.25);
}

.dark-mode .alert-header {
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.dark-mode .alert-item {
  background-color: rgba(30, 30, 46, 0.7);
  border-color: #3a3a55;
}

.dark-mode .alert-item.border-danger {
  border-left-color: #e74c3c;
}

.dark-mode .alert-item.border-warning {
  border-left-color: #f1c40f;
}

.dark-mode .alert-text {
  color: #e0e0e0;
}

.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.alert-title {
  font-weight: bold;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
}

.alert-item {
  border-left: 4px solid #ddd;
  border-radius: 0.5rem;
  background-color: rgba(255, 255, 255, 0.7);
  transition: transform 0.2s;
}

.alert-item:hover {
  transform: translateX(5px);
}

.alert-text {
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .alert-list {
    padding: 0.75rem;
    margin: 0.5rem 0;
  }
  
  .alert-title {
    font-size: 1rem;
  }
  
  .alert-item {
    font-size: 0.9rem;
  }
}
</style> 