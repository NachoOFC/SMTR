<template>
  <div class="dashboard">
    <Sidebar />
    <div class="main-content">
      <Topbar />
      <h1>Centro de Alertas</h1>
      
      <div class="alerts-container">
        <div class="alert-filters">
          <span class="filter-chip active">Todas</span>
          <span class="filter-chip">Críticas</span>
          <span class="filter-chip">Precaución</span>
          <span class="filter-chip">Resueltas</span>
        </div>
        
        <div class="alerts-list">
          <div class="alert-card critical">
            <div class="alert-header">
              <span class="alert-badge critical">Crítico</span>
              <span class="alert-time">Hace 35 min</span>
            </div>
            <div class="alert-title">Temperatura Elevada (72°C) - Tablero Principal</div>
            <div class="alert-location">Puerto Varas, Tablero de Distribución</div>
            <div class="alert-actions">
              <button class="btn-resolve">Marcar resuelta</button>
              <button class="btn-details">Ver detalles</button>
            </div>
          </div>
          
          <div class="alert-card warning">
            <div class="alert-header">
              <span class="alert-badge warning">Precaución</span>
              <span class="alert-time">Hace 1h 12min</span>
            </div>
            <div class="alert-title">Temperatura Elevada (60°C) - Tablero Principal</div>
            <div class="alert-location">Puerto Varas, Tablero de Distribución</div>
            <div class="alert-actions">
              <button class="btn-resolve">Marcar resuelta</button>
              <button class="btn-details">Ver detalles</button>
            </div>
          </div>
          
          <div class="alert-card warning">
            <div class="alert-header">
              <span class="alert-badge warning">Precaución</span>
              <span class="alert-time">Hace 2h 45min</span>
            </div>
            <div class="alert-title">Vibración anómala - Motor Portón</div>
            <div class="alert-location">Osorno, Motor Portón Elec.</div>
            <div class="alert-actions">
              <button class="btn-resolve">Marcar resuelta</button>
              <button class="btn-details">Ver detalles</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '~/components/Sidebar.vue'
import Topbar from '~/components/Topbar.vue'
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  background: #f7f7fb;
}
.main-content {
  flex: 1;
  padding: 0 2rem;
}
h1 {
  color: #333;
  margin-top: 1.5rem;
}
.alerts-container {
  margin-top: 1.5rem;
}
.alert-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.filter-chip {
  background: #eee;
  padding: 0.5rem 1.5rem;
  border-radius: 1.5rem;
  cursor: pointer;
  font-weight: bold;
  color: #555;
}
.filter-chip.active {
  background: #d16ba5;
  color: white;
}
.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.alert-card {
  background: white;
  border-radius: 1rem;
  padding: 1.2rem 1.5rem;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
}
.alert-card.critical {
  border-left: 4px solid #e74c3c;
}
.alert-card.warning {
  border-left: 4px solid #f1c40f;
}
.alert-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
}
.alert-badge {
  padding: 0.2rem 1rem;
  border-radius: 1rem;
  font-weight: bold;
  font-size: 0.9rem;
}
.alert-badge.critical {
  background: #e74c3c;
  color: white;
}
.alert-badge.warning {
  background: #f1c40f;
  color: #333;
}
.alert-time {
  color: #777;
  font-size: 0.9rem;
}
.alert-title {
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}
.alert-location {
  color: #555;
  margin-bottom: 1rem;
}
.alert-actions {
  display: flex;
  gap: 0.8rem;
  margin-top: 0.5rem;
}
.btn-resolve {
  background: #eee;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
}
.btn-details {
  background: none;
  border: 1px solid #ccc;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
}
</style> 