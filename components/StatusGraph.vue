<template>
  <div class="status-graph" :class="{ 'dark-mode': darkMode }">
    <h3 class="graph-title">Estado de Activos</h3>
    <div class="graph-container">
      <div class="status-bar">
        <div class="status-item critico">
          <div class="status-label">Crítico</div>
          <div class="status-value">{{ criticoCount }}</div>
          <div class="status-bar-fill" :style="{ width: `${criticoPercentage}%` }"></div>
        </div>
        <div class="status-item precaucion">
          <div class="status-label">Precaución</div>
          <div class="status-value">{{ precaucionCount }}</div>
          <div class="status-bar-fill" :style="{ width: `${precaucionPercentage}%` }"></div>
        </div>
        <div class="status-item bueno">
          <div class="status-label">Bueno</div>
          <div class="status-value">{{ buenoCount }}</div>
          <div class="status-bar-fill" :style="{ width: `${buenoPercentage}%` }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatusGraph',
  props: {
    darkMode: {
      type: Boolean,
      default: false
    },
    assets: {
      type: Array,
      required: true
    }
  },
  computed: {
    criticoCount() {
      return this.assets.filter(asset => asset.status === 'Crítico').length;
    },
    precaucionCount() {
      return this.assets.filter(asset => asset.status === 'Precaución').length;
    },
    buenoCount() {
      return this.assets.filter(asset => asset.status === 'Bueno').length;
    },
    totalAssets() {
      return this.assets.length;
    },
    criticoPercentage() {
      return this.totalAssets ? (this.criticoCount / this.totalAssets) * 100 : 0;
    },
    precaucionPercentage() {
      return this.totalAssets ? (this.precaucionCount / this.totalAssets) * 100 : 0;
    },
    buenoPercentage() {
      return this.totalAssets ? (this.buenoCount / this.totalAssets) * 100 : 0;
    }
  }
}
</script>

<style scoped>
.status-graph {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  margin: 20px 0;
  border: 1px solid #e0e0e0;
}

.graph-title {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.2rem;
}

.graph-container {
  width: 100%;
}

.status-bar {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.status-item {
  position: relative;
  height: 40px;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 0 15px;
}

.status-label {
  position: relative;
  z-index: 2;
  font-weight: 500;
  min-width: 100px;
}

.status-value {
  position: relative;
  z-index: 2;
  margin-left: auto;
  font-weight: 600;
}

.status-bar-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  transition: width 0.3s ease;
}

.critico .status-bar-fill {
  background: rgba(220, 53, 69, 0.5);
}

.precaucion .status-bar-fill {
  background: rgba(255, 193, 7, 0.5);
}

.bueno .status-bar-fill {
  background: rgba(40, 167, 69, 0.5);
}

/* Dark mode styles */
.dark-mode {
  background: #272741;
  border: 1px solid #3a3a55;
}

.dark-mode .graph-title {
  color: #f0f0f0;
}

.dark-mode .status-item {
  background: #1a1a2e;
}

.dark-mode .status-label,
.dark-mode .status-value {
  color: #f0f0f0;
}

.dark-mode .critico .status-bar-fill {
  background: rgba(220, 53, 69, 0.4);
}

.dark-mode .precaucion .status-bar-fill {
  background: rgba(255, 193, 7, 0.4);
}

.dark-mode .bueno .status-bar-fill {
  background: rgba(40, 167, 69, 0.4);
}
</style> 