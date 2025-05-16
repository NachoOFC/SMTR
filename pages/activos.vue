<template>
  <div class="dashboard">
    <Sidebar />
    <div class="main-content">
      <Topbar />
      <h1>Gestión de Activos</h1>
      
      <div class="actions-bar">
        <div class="search-container">
          <input type="text" placeholder="Buscar activo..." class="search-input" />
          <button class="search-button">🔍</button>
        </div>
        
        <div class="filters">
          <select class="filter-select">
            <option value="">Todos los tipos</option>
            <option value="electric">Eléctricos</option>
            <option value="temp">Temperatura</option>
            <option value="vib">Vibración</option>
            <option value="security">Seguridad</option>
          </select>
          
          <select class="filter-select">
            <option value="">Todas las ubicaciones</option>
            <option value="puerto-varas">Puerto Varas</option>
            <option value="osorno">Osorno</option>
            <option value="los-muermos">Los Muermos</option>
          </select>
          
          <select class="filter-select">
            <option value="">Todos los estados</option>
            <option value="bueno">Bueno</option>
            <option value="precaucion">Precaución</option>
            <option value="critico">Crítico</option>
          </select>
        </div>
        
        <button class="btn-add">
          <span>+</span> Nuevo Activo
        </button>
      </div>
      
      <div class="assets-grid">
        <div class="asset-card">
          <div class="asset-header">
            <span class="asset-title">Batería UPS</span>
            <span class="asset-badge green">90%</span>
          </div>
          <div class="asset-details">
            <div class="detail-item">
              <span class="detail-label">ID:</span>
              <span>BAT-001</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Sector:</span>
              <span>Los Muermos</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Tipo:</span>
              <span>Eléctrico</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Estado:</span>
              <span class="status good">Bueno</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Última revisión:</span>
              <span>12/07/2023</span>
            </div>
          </div>
          <div class="asset-actions">
            <button class="btn-asset">Ver detalles</button>
            <button class="btn-asset">Editar</button>
          </div>
        </div>
        
        <div class="asset-card">
          <div class="asset-header">
            <span class="asset-title">Tablero de Distribución</span>
            <span class="asset-badge red">70°C</span>
          </div>
          <div class="asset-details">
            <div class="detail-item">
              <span class="detail-label">ID:</span>
              <span>TAB-002</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Sector:</span>
              <span>Puerto Varas</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Tipo:</span>
              <span>Temperatura</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Estado:</span>
              <span class="status critical">Crítico</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Última revisión:</span>
              <span>15/07/2023</span>
            </div>
          </div>
          <div class="asset-actions">
            <button class="btn-asset">Ver detalles</button>
            <button class="btn-asset">Editar</button>
          </div>
        </div>
        
        <div class="asset-card">
          <div class="asset-header">
            <span class="asset-title">Motor Portón Eléctrico</span>
            <span class="asset-badge yellow">2.9g</span>
          </div>
          <div class="asset-details">
            <div class="detail-item">
              <span class="detail-label">ID:</span>
              <span>MOT-003</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Sector:</span>
              <span>Osorno</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Tipo:</span>
              <span>Vibración</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Estado:</span>
              <span class="status warning">Precaución</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Última revisión:</span>
              <span>10/07/2023</span>
            </div>
          </div>
          <div class="asset-actions">
            <button class="btn-asset">Ver detalles</button>
            <button class="btn-asset">Editar</button>
          </div>
        </div>
        
        <div class="asset-card">
          <div class="asset-header">
            <span class="asset-title">Sensor Puerta Principal</span>
            <span class="asset-badge green">Activo</span>
          </div>
          <div class="asset-details">
            <div class="detail-item">
              <span class="detail-label">ID:</span>
              <span>SENS-004</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Sector:</span>
              <span>Los Muermos</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Tipo:</span>
              <span>Seguridad</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Estado:</span>
              <span class="status good">Bueno</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Última revisión:</span>
              <span>14/07/2023</span>
            </div>
          </div>
          <div class="asset-actions">
            <button class="btn-asset">Ver detalles</button>
            <button class="btn-asset">Editar</button>
          </div>
        </div>
        
        <div class="asset-card">
          <div class="asset-header">
            <span class="asset-title">Panel Solar</span>
            <span class="asset-badge green">88%</span>
          </div>
          <div class="asset-details">
            <div class="detail-item">
              <span class="detail-label">ID:</span>
              <span>PAN-005</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Sector:</span>
              <span>Puerto Varas</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Tipo:</span>
              <span>Eléctrico</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Estado:</span>
              <span class="status good">Bueno</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Última revisión:</span>
              <span>13/07/2023</span>
            </div>
          </div>
          <div class="asset-actions">
            <button class="btn-asset">Ver detalles</button>
            <button class="btn-asset">Editar</button>
          </div>
        </div>
        
        <div class="asset-card">
          <div class="asset-header">
            <span class="asset-title">Sensor de Humedad</span>
            <span class="asset-badge blue">45%</span>
          </div>
          <div class="asset-details">
            <div class="detail-item">
              <span class="detail-label">ID:</span>
              <span>HUM-006</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Sector:</span>
              <span>Osorno</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Tipo:</span>
              <span>Ambiental</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Estado:</span>
              <span class="status good">Bueno</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Última revisión:</span>
              <span>08/07/2023</span>
            </div>
          </div>
          <div class="asset-actions">
            <button class="btn-asset">Ver detalles</button>
            <button class="btn-asset">Editar</button>
          </div>
        </div>
      </div>
      
      <div class="pagination">
        <button class="page-btn">&lt;</button>
        <button class="page-btn active">1</button>
        <button class="page-btn">2</button>
        <button class="page-btn">3</button>
        <span>...</span>
        <button class="page-btn">5</button>
        <button class="page-btn">&gt;</button>
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
.actions-bar {
  display: flex;
  justify-content: space-between;
  margin: 1.5rem 0;
  gap: 1rem;
}
.search-container {
  display: flex;
  align-items: center;
}
.search-input {
  padding: 0.6rem 1rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem 0 0 0.5rem;
  width: 250px;
}
.search-button {
  background: #5b8ac6;
  border: none;
  color: white;
  padding: 0.6rem 1rem;
  border-radius: 0 0.5rem 0.5rem 0;
  cursor: pointer;
}
.filters {
  display: flex;
  gap: 0.8rem;
}
.filter-select {
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  background: white;
}
.btn-add {
  background: #4caf50;
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: bold;
}
.btn-add span {
  font-size: 1.2rem;
}
.assets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}
.asset-card {
  background: white;
  border-radius: 0.8rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.asset-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
}
.asset-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}
.asset-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 1rem;
  font-weight: bold;
}
.asset-badge.green {
  background: #6fdc6f;
  color: #222;
}
.asset-badge.red {
  background: #ff5e5e;
  color: white;
}
.asset-badge.yellow {
  background: #ffe066;
  color: #222;
}
.asset-badge.blue {
  background: #64b5f6;
  color: #222;
}
.asset-details {
  border-top: 1px solid #eee;
  padding-top: 1rem;
}
.detail-item {
  display: flex;
  margin-bottom: 0.6rem;
}
.detail-label {
  width: 110px;
  color: #666;
}
.status {
  padding: 0.2rem 0.7rem;
  border-radius: 1rem;
  font-size: 0.9rem;
}
.status.good {
  background: #e8f5e9;
  color: #4caf50;
}
.status.warning {
  background: #fff8e1;
  color: #ff9800;
}
.status.critical {
  background: #ffebee;
  color: #f44336;
}
.asset-actions {
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
  margin-top: 1.2rem;
}
.btn-asset {
  flex: 1;
  padding: 0.6rem;
  border: 1px solid #ddd;
  background: #f5f5f5;
  border-radius: 0.5rem;
  cursor: pointer;
}
.pagination {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
  gap: 0.5rem;
  align-items: center;
}
.page-btn {
  width: 2.2rem;
  height: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  background: white;
  border-radius: 0.3rem;
  cursor: pointer;
}
.page-btn.active {
  background: #5b8ac6;
  color: white;
  border-color: #5b8ac6;
}
</style> 