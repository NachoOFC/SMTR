<template>
  <div :class="['dashboard', darkMode ? 'dark-mode' : '']">
    <Sidebar />
    <div class="main-content">
      <Topbar :darkMode="darkMode" @toggle-theme="toggleTheme" @update-search="updateSearch" />
      
      <div class="container-fluid px-md-4">
        <!-- Header Section -->
        <div class="row mt-4">
          <div class="col-12">
            <div class="charts-header">
              <div class="header-content">
                <h1 class="charts-title">
                  <i class="bi bi-graph-up-arrow"></i>
                  Gráficos de {{ variableLabel }}
                </h1>
                <p class="charts-subtitle">Monitoreo en tiempo real y análisis histórico</p>
              </div>
              <div class="header-actions">
                <div class="variable-filters">
                  <button v-for="v in variableOptions" :key="v.value" @click="selectVariable(v.value)" :class="['variable-btn', { active: selectedVariable === v.value }]">
                    <i :class="v.icon"></i> {{ v.label }}
                  </button>
                </div>
                <div class="time-filters">
                  <button 
                    v-for="period in timePeriods" 
                    :key="period.value"
                    @click="selectTimePeriod(period.value)"
                    :class="['time-filter-btn', { active: selectedPeriod === period.value }]"
                  >
                    {{ period.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Overview Cards -->
        <div class="row mt-4">
          <div class="col-md-3 mb-3" v-for="card in statCards" :key="card.label">
            <div :class="['temp-card', card.type]">
              <div class="temp-card-icon">
                <i :class="card.icon"></i>
              </div>
              <div class="temp-card-content">
                <h3 class="temp-value">{{ card.value }}</h3>
                <p class="temp-label">{{ card.label }}</p>
                <div v-if="card.trend !== undefined" class="temp-trend" :class="card.trend">
                  <i :class="card.trendIcon"></i>
                  {{ card.change }}
                </div>
                <div v-if="card.time" class="temp-time">
                  <i class="bi bi-clock"></i>
                  {{ card.time }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Chart Section -->
        <div class="row mt-4">
          <div class="col-12">
            <div class="chart-container">
              <div class="chart-header">
                <h3 class="chart-title">Evolución de {{ variableLabel }}</h3>
                <div class="chart-controls">
                  <select v-model="selectedAsset" class="form-select asset-select">
                    <option value="">Todos los sensores</option>
                    <option v-for="asset in assets" :key="asset.id" :value="asset.id">
                      {{ asset.name }}
                    </option>
                  </select>
                  <div class="chart-type-toggle">
                    <button 
                      @click="chartType = 'line'"
                      :class="['chart-type-btn', { active: chartType === 'line' }]"
                    >
                      <i class="bi bi-graph-up"></i>
                    </button>
                    <button 
                      @click="chartType = 'area'"
                      :class="['chart-type-btn', { active: chartType === 'area' }]"
                    >
                      <i class="bi bi-graph-up-arrow"></i>
                    </button>
                    <button 
                      @click="chartType = 'bar'"
                      :class="['chart-type-btn', { active: chartType === 'bar' }]"
                    >
                      <i class="bi bi-bar-chart"></i>
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="chart-wrapper">
                <LineChart 
                  v-if="chartType === 'line'"
                  :chartData="chartData"
                  :options="chartOptions"
                />
                <AreaChart 
                  v-else-if="chartType === 'area'"
                  :chartData="areaChartData"
                  :options="chartOptions"
                />
                <BarChart 
                  v-else-if="chartType === 'bar'"
                  :chartData="barChartData"
                  :options="barChartOptions"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Charts Row -->
        <div class="row mt-4">
          <div class="col-md-6 mb-4">
            <div class="chart-container">
              <div class="chart-header">
                <h3 class="chart-title">Distribución por Hora</h3>
              </div>
              <div class="chart-wrapper">
                <BarChart 
                  :chartData="hourlyData"
                  :options="barChartOptions"
                />
              </div>
            </div>
          </div>
          
          <div class="col-md-6 mb-4">
            <div class="chart-container">
              <div class="chart-header">
                <h3 class="chart-title">Tendencia Semanal</h3>
              </div>
              <div class="chart-wrapper">
                <RadarChart 
                  :chartData="weeklyData"
                  :options="radarChartOptions"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Temperature Alerts Section -->
        <div class="row mt-4">
          <div class="col-12">
            <div class="alerts-container">
              <div class="alerts-header">
                <h3 class="alerts-title">
                  <i class="bi bi-exclamation-triangle"></i>
                  Alertas de Temperatura
                </h3>
              </div>
              <div class="alerts-grid">
                <div 
                  v-for="alert in temperatureAlerts" 
                  :key="alert.id"
                  :class="['alert-card', alert.level]"
                >
                  <div class="alert-icon">
                    <i :class="alert.icon"></i>
                  </div>
                  <div class="alert-content">
                    <h4 class="alert-title">{{ alert.title }}</h4>
                    <p class="alert-description">{{ alert.description }}</p>
                    <div class="alert-time">{{ alert.time }}</div>
                  </div>
                  <div class="alert-temp">
                    {{ alert.temperature }}°C
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Sidebar from '~/components/Sidebar.vue'
import Topbar from '~/components/Topbar.vue'
import LineChart from '~/components/charts/LineChart.vue'
import AreaChart from '~/components/charts/AreaChart.vue'
import BarChart from '~/components/charts/BarChart.vue'
import RadarChart from '~/components/charts/RadarChart.vue'
import { useTemperatureData } from '~/composables/useTemperatureData'

const darkMode = ref(false)
const selectedPeriod = ref('24h')
const chartType = ref('line')
const selectedAsset = ref('')
const timePeriods = [
  { label: '1H', value: '1h' },
  { label: '24H', value: '24h' },
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: '1M', value: '1m' }
]
const variableOptions = [
  { label: 'Temperatura', value: 'temperature', icon: 'bi bi-thermometer-half' },
  { label: 'Humedad', value: 'humidity', icon: 'bi bi-droplet-half' },
  { label: 'Consumo', value: 'consumption', icon: 'bi bi-lightning-charge' }
]

const {
  selectedVariable,
  changeVariable,
  selectedTimeframe,
  changeTimeframe,
  getHistory,
  getStatsByVariable,
  initializeData
} = useTemperatureData()

const assets = ref([
  { id: '1', name: 'Tablero General de Distribución', type: 'temp' },
  { id: '2', name: 'Banco de Baterías de UPS', type: 'temp' },
  { id: '3', name: 'Motor de Portón Eléctrico', type: 'temp' }
])

onMounted(() => {
  darkMode.value = localStorage.getItem('darkMode') === 'true'
  if (darkMode.value) document.body.classList.add('dark-mode')
  else document.body.classList.remove('dark-mode')
  initializeData()
})

watch(selectedPeriod, (val) => {
  changeTimeframe(val)
})

const variableLabel = computed(() => {
  const found = variableOptions.find(v => v.value === selectedVariable.value)
  return found ? found.label : 'Temperatura'
})

function selectVariable(v) {
  changeVariable(v)
}
function selectTimePeriod(period) {
  selectedPeriod.value = period
}
function toggleTheme() {
  darkMode.value = !darkMode.value
  localStorage.setItem('darkMode', darkMode.value)
  if (darkMode.value) document.body.classList.add('dark-mode')
  else document.body.classList.remove('dark-mode')
}
function updateSearch() {}

// Tarjetas de estadísticas
const statCards = computed(() => {
  const stats = getStatsByVariable.value
  if (!stats) return []
  let unit = ''
  let icon = ''
  let decimals = 2
  let type = ''
  if (selectedVariable.value === 'temperature') {
    unit = '°C'; icon = 'bi bi-thermometer-half'; decimals = 1; type = 'current'
  } else if (selectedVariable.value === 'humidity') {
    unit = '%'; icon = 'bi bi-droplet-half'; decimals = 2; type = 'current'
  } else if (selectedVariable.value === 'consumption') {
    unit = 'kWh'; icon = 'bi bi-lightning-charge'; decimals = 2; type = 'current'
  }
  return [
    {
      label: `Actual`, value: stats.current?.toFixed(decimals) + unit, icon, type,
      trend: stats.trend, trendIcon: stats.trend === 'up' ? 'bi bi-arrow-up' : 'bi bi-arrow-down', change: (stats.change > 0 ? '+' : '') + stats.change + unit
    },
    {
      label: `Promedio`, value: stats.average?.toFixed(decimals) + unit, icon: 'bi bi-graph-up', type: 'average', change: '', trend: '', trendIcon: ''
    },
    {
      label: `Máxima`, value: stats.maximum?.toFixed(decimals) + unit, icon: 'bi bi-arrow-up-circle', type: 'max', time: stats.maxTime
    },
    {
      label: `Mínima`, value: stats.minimum?.toFixed(decimals) + unit, icon: 'bi bi-arrow-down-circle', type: 'min', time: stats.minTime
    }
  ]
})

// Gráficos principales
const chartData = computed(() => ({
  labels: getHistory.value.map(d => new Date(d.time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })),
  datasets: [{
    label: variableLabel.value,
    data: getHistory.value.map(d => d.value),
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderWidth: 3,
    fill: false,
    tension: 0.4,
    pointRadius: 4,
    pointHoverRadius: 6
  }]
}))
const areaChartData = computed(() => ({
  ...chartData.value,
  datasets: chartData.value.datasets.map(ds => ({ ...ds, fill: true, backgroundColor: 'rgba(33, 150, 243, 0.2)', borderColor: '#2196F3' }))
}))
const barChartData = computed(() => ({
  ...chartData.value,
  datasets: chartData.value.datasets.map(ds => ({ ...ds, backgroundColor: 'rgba(156, 39, 176, 0.6)', borderColor: '#9C27B0', borderWidth: 1 }))
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: darkMode.value ? '#ffffff' : '#333333',
        font: { size: 12 }
      }
    },
    tooltip: {
      backgroundColor: darkMode.value ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
      titleColor: darkMode.value ? '#ffffff' : '#333333',
      bodyColor: darkMode.value ? '#ffffff' : '#333333',
      borderColor: darkMode.value ? '#444444' : '#e0e0e0',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: false
    }
  },
  scales: {
    x: {
      grid: { color: darkMode.value ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
      ticks: { color: darkMode.value ? '#ffffff' : '#333333' }
    },
    y: {
      grid: { color: darkMode.value ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
      ticks: {
        color: darkMode.value ? '#ffffff' : '#333333',
        callback: value => {
          if (selectedVariable.value === 'temperature') return value + '°C'
          if (selectedVariable.value === 'humidity') return value + '%'
          if (selectedVariable.value === 'consumption') return value + 'kWh'
          return value
        }
      }
    }
  },
  interaction: { intersect: false, mode: 'index' }
}))
const barChartOptions = chartOptions
const radarChartOptions = chartOptions

// Simulación de datos por hora y semana (puedes mejorar según tu lógica)
const hourlyData = chartData
const weeklyData = chartData
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  background: #f7f7fb;
}

.main-content {
  flex: 1;
  margin-left: 220px;
  transition: all 0.3s ease;
}

.charts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  margin-bottom: 1rem;
}

.header-content .charts-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.charts-subtitle {
  color: #7f8c8d;
  margin: 0.5rem 0 0 0;
  font-size: 0.95rem;
}

.variable-filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.variable-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.variable-btn.active {
  background: #007bff;
  border-color: #007bff;
  color: white;
}

.time-filters {
  display: flex;
  gap: 0.5rem;
}

.time-filter-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.time-filter-btn:hover {
  background: #f8f9fa;
  border-color: #007bff;
  color: #007bff;
}

.time-filter-btn.active {
  background: #007bff;
  border-color: #007bff;
  color: white;
}

.temp-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease;
}

.temp-card:hover {
  transform: translateY(-2px);
}

.temp-card-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.temp-card.current .temp-card-icon {
  background: linear-gradient(135deg, #4CAF50, #45a049);
}

.temp-card.average .temp-card-icon {
  background: linear-gradient(135deg, #2196F3, #1976D2);
}

.temp-card.max .temp-card-icon {
  background: linear-gradient(135deg, #FF5722, #E64A19);
}

.temp-card.min .temp-card-icon {
  background: linear-gradient(135deg, #9C27B0, #7B1FA2);
}

.temp-card-content {
  flex: 1;
}

.temp-value {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  color: #2c3e50;
}

.temp-label {
  color: #7f8c8d;
  margin: 0.25rem 0;
  font-size: 0.9rem;
}

.temp-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  font-weight: 500;
}

.temp-trend.up {
  color: #4CAF50;
}

.temp-trend.down {
  color: #F44336;
}

.temp-time {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  color: #7f8c8d;
}

.chart-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  overflow: hidden;
}

.chart-header {
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.chart-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.asset-select {
  min-width: 200px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.chart-type-toggle {
  display: flex;
  gap: 0.25rem;
}

.chart-type-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chart-type-btn:hover {
  background: #f8f9fa;
  border-color: #007bff;
  color: #007bff;
}

.chart-type-btn.active {
  background: #007bff;
  border-color: #007bff;
  color: white;
}

.chart-wrapper {
  height: 400px;
  padding: 1rem;
}

.alerts-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  overflow: hidden;
}

.alerts-header {
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.alerts-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.alerts-grid {
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.alert-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid;
}

.alert-card.critical {
  background: rgba(244, 67, 54, 0.1);
  border-left-color: #F44336;
}

.alert-card.warning {
  background: rgba(255, 152, 0, 0.1);
  border-left-color: #FF9800;
}

.alert-card.info {
  background: rgba(33, 150, 243, 0.1);
  border-left-color: #2196F3;
}

.alert-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.alert-card.critical .alert-icon {
  background: #F44336;
  color: white;
}

.alert-card.warning .alert-icon {
  background: #FF9800;
  color: white;
}

.alert-card.info .alert-icon {
  background: #2196F3;
  color: white;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
}

.alert-description {
  font-size: 0.9rem;
  color: #7f8c8d;
  margin: 0 0 0.25rem 0;
}

.alert-time {
  font-size: 0.8rem;
  color: #95a5a6;
}

.alert-temp {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
}

/* Dark mode styles */
.dark-mode {
  background: #1a1a1a;
}

.dark-mode .charts-header,
.dark-mode .temp-card,
.dark-mode .chart-container,
.dark-mode .alerts-container {
  background: #2d2d2d;
  color: #ffffff;
}

.dark-mode .charts-title,
.dark-mode .chart-title,
.dark-mode .alerts-title,
.dark-mode .temp-value,
.dark-mode .alert-title,
.dark-mode .alert-temp {
  color: #ffffff;
}

.dark-mode .charts-subtitle,
.dark-mode .temp-label,
.dark-mode .alert-description {
  color: #b0b0b0;
}

.dark-mode .time-filter-btn {
  background: #2d2d2d;
  border-color: #444444;
  color: #b0b0b0;
}

.dark-mode .time-filter-btn:hover {
  background: #3d3d3d;
  border-color: #007bff;
  color: #007bff;
}

.dark-mode .asset-select,
.dark-mode .chart-type-btn {
  background: #2d2d2d;
  border-color: #444444;
  color: #b0b0b0;
}

.dark-mode .chart-type-btn:hover {
  background: #3d3d3d;
  border-color: #007bff;
  color: #007bff;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
  
  .charts-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .chart-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .chart-controls {
    width: 100%;
    justify-content: space-between;
  }
  
  .alerts-grid {
    grid-template-columns: 1fr;
  }
}
</style> 