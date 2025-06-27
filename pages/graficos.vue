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
                <p class="charts-subtitle">
                  Monitoreo en tiempo real y análisis histórico
                  <span v-if="selectedAsset" class="selected-asset">
                    - {{ getAssetName(selectedAsset) }}
                  </span>
                </p>
              </div>
              <div class="header-actions">
                <div class="variable-filters">
                  <button 
                    v-for="v in variableOptions" 
                    :key="v.value" 
                    @click="selectVariable(v.value)" 
                    :class="['variable-btn', { active: selectedVariable === v.value }]"
                  >
                    <i :class="v.icon"></i> {{ v.label }}
                  </button>
                </div>
                <div class="time-filters">
                  <button 
                    v-for="period in timePeriods" 
                    :key="period.value"
                    @click="selectTimePeriod(period.value)"
                    :class="['time-filter-btn', { active: selectedTimeframe === period.value }]"
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
                      {{ asset.name }} - {{ asset.sector }}
                    </option>
                  </select>
                  <div class="chart-type-toggle">
                    <button 
                      @click="chartType = 'line'"
                      :class="['chart-type-btn', { active: chartType === 'line' }]"
                      title="Gráfico de líneas"
                    >
                      <i class="bi bi-graph-up"></i>
                    </button>
                    <button 
                      @click="chartType = 'area'"
                      :class="['chart-type-btn', { active: chartType === 'area' }]"
                      title="Gráfico de área"
                    >
                      <i class="bi bi-graph-up-arrow"></i>
                    </button>
                    <button 
                      @click="chartType = 'bar'"
                      :class="['chart-type-btn', { active: chartType === 'bar' }]"
                      title="Gráfico de barras"
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
                <h3 class="chart-title">Comparación por Activo</h3>
              </div>
              <div class="chart-wrapper">
                <RadarChart 
                  :chartData="assetComparisonData"
                  :options="radarChartOptions"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Assets Status Grid -->
        <div class="row mt-4">
          <div class="col-12">
            <div class="assets-status-container">
              <div class="assets-header">
                <h3 class="assets-title">
                  <i class="bi bi-cpu"></i>
                  Estado de Activos
                </h3>
              </div>
              <div class="assets-grid">
                <div 
                  v-for="asset in assets" 
                  :key="asset.id"
                  :class="['asset-card', asset.status, { active: selectedAsset === asset.id }]"
                  @click="selectAsset(asset.id)"
                >
                  <div class="asset-status-indicator">
                    <div :class="['status-dot', asset.status]"></div>
                  </div>
                  <div class="asset-info">
                    <h4 class="asset-name">{{ asset.name }}</h4>
                    <p class="asset-sector">{{ asset.sector }}</p>
                    <div class="asset-metrics">
                      <span class="metric">
                        <i class="bi bi-thermometer-half"></i>
                        {{ getCurrentValue(asset.id, 'temperature') }}°C
                      </span>
                      <span class="metric">
                        <i class="bi bi-droplet-half"></i>
                        {{ getCurrentValue(asset.id, 'humidity') }}%
                      </span>
                      <span class="metric">
                        <i class="bi bi-lightning-charge"></i>
                        {{ getCurrentValue(asset.id, 'consumption') }}kWh
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Temperature Alerts Section -->
        <div class="row mt-4" v-if="temperatureAlerts.length > 0">
          <div class="col-12">
            <div class="alerts-container">
              <div class="alerts-header">
                <h3 class="alerts-title">
                  <i class="bi bi-exclamation-triangle"></i>
                  Alertas de Temperatura ({{ temperatureAlerts.length }})
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
const chartType = ref('line')

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
  assets,
  selectedTimeframe,
  selectedAsset,
  selectedVariable,
  assetsData,
  getHistory,
  getStatsByVariable,
  getTemperatureAlerts,
  initializeData,
  changeTimeframe,
  changeVariable,
  saveToLocalStorage,
  loadFromLocalStorage
} = useTemperatureData()

onMounted(() => {
  darkMode.value = localStorage.getItem('darkMode') === 'true'
  if (darkMode.value) document.body.classList.add('dark-mode')
  else document.body.classList.remove('dark-mode')
  
  // Intentar cargar datos guardados o inicializar nuevos
  if (!loadFromLocalStorage()) {
    initializeData()
  }
  
  // Guardar datos cada minuto
  setInterval(() => {
    saveToLocalStorage()
  }, 60000)
})

// Watchers para cambios
watch(selectedTimeframe, (val) => {
  changeTimeframe(val)
})

watch(selectedVariable, (val) => {
  changeVariable(val)
})

watch(selectedAsset, () => {
  // Forzar actualización de gráficos cuando cambia el activo
})

// Computed properties
const variableLabel = computed(() => {
  const found = variableOptions.find(v => v.value === selectedVariable.value)
  return found ? found.label : 'Temperatura'
})

const temperatureAlerts = computed(() => getTemperatureAlerts.value)

// Métodos
function selectVariable(v) {
  changeVariable(v)
}

function selectTimePeriod(period) {
  changeTimeframe(period)
}

function selectAsset(assetId) {
  selectedAsset.value = selectedAsset.value === assetId ? '' : assetId
}

function getAssetName(assetId) {
  const asset = assets.value.find(a => a.id === assetId)
  return asset ? asset.name : ''
}

function getCurrentValue(assetId, variable) {
  if (assetsData.value[assetId] && assetsData.value[assetId][variable]) {
    const data = assetsData.value[assetId][variable]
    const current = data[data.length - 1]?.value || 0
    return variable === 'temperature' ? current.toFixed(1) : current.toFixed(2)
  }
  return '0'
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
      label: `Actual`, 
      value: stats.current?.toFixed(decimals) + unit, 
      icon, 
      type,
      trend: stats.trend, 
      trendIcon: stats.trend === 'up' ? 'bi bi-arrow-up' : 'bi bi-arrow-down', 
      change: (stats.change > 0 ? '+' : '') + stats.change.toFixed(decimals) + unit
    },
    {
      label: `Promedio`, 
      value: stats.average?.toFixed(decimals) + unit, 
      icon: 'bi bi-graph-up', 
      type: 'average'
    },
    {
      label: `Máxima`, 
      value: stats.maximum?.toFixed(decimals) + unit, 
      icon: 'bi bi-arrow-up-circle', 
      type: 'max', 
      time: stats.maxTime
    },
  {
      label: `Mínima`, 
      value: stats.minimum?.toFixed(decimals) + unit, 
      icon: 'bi bi-arrow-down-circle', 
      type: 'min', 
      time: stats.minTime
    }
  ]
})

// Datos para gráficos
const chartData = computed(() => {
  const history = getHistory.value
  if (!history.length) return { labels: [], datasets: [] }

  const labels = history.map(d => 
    new Date(d.time).toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  )
  
  const data = history.map(d => d.value)
  
  let borderColor = '#3b82f6'
  let backgroundColor = 'rgba(59, 130, 246, 0.1)'
  
  if (selectedVariable.value === 'temperature') {
    borderColor = '#ef4444'
    backgroundColor = 'rgba(239, 68, 68, 0.1)'
  } else if (selectedVariable.value === 'humidity') {
    borderColor = '#06b6d4'
    backgroundColor = 'rgba(6, 182, 212, 0.1)'
  } else if (selectedVariable.value === 'consumption') {
    borderColor = '#f59e0b'
    backgroundColor = 'rgba(245, 158, 11, 0.1)'
  }

  return {
    labels,
    datasets: [{
      label: variableLabel.value,
      data,
      borderColor,
      backgroundColor,
      borderWidth: 2,
      fill: false,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 4
    }]
  }
})

const areaChartData = computed(() => {
  const base = chartData.value
  return {
    ...base,
    datasets: base.datasets.map(dataset => ({
      ...dataset,
      fill: true,
      backgroundColor: dataset.backgroundColor
    }))
  }
})

const barChartData = computed(() => {
  const base = chartData.value
  return {
    ...base,
    datasets: base.datasets.map(dataset => ({
      ...dataset,
      backgroundColor: dataset.borderColor,
      borderWidth: 0
    }))
  }
})

// Datos por horas
const hourlyData = computed(() => {
  const history = getHistory.value
  if (!history.length) return { labels: [], datasets: [] }

  const hourlyStats = {}
  
  history.forEach(d => {
    const hour = new Date(d.time).getHours()
    if (!hourlyStats[hour]) {
      hourlyStats[hour] = { values: [], count: 0 }
    }
    hourlyStats[hour].values.push(d.value)
    hourlyStats[hour].count++
  })

  const labels = []
  const data = []
  
  for (let hour = 0; hour < 24; hour++) {
    labels.push(`${hour.toString().padStart(2, '0')}:00`)
    if (hourlyStats[hour]) {
      const avg = hourlyStats[hour].values.reduce((a, b) => a + b, 0) / hourlyStats[hour].values.length
      data.push(Math.round(avg * 100) / 100)
    } else {
      data.push(0)
    }
  }

  let borderColor = '#3b82f6'
  if (selectedVariable.value === 'temperature') borderColor = '#ef4444'
  else if (selectedVariable.value === 'humidity') borderColor = '#06b6d4'
  else if (selectedVariable.value === 'consumption') borderColor = '#f59e0b'

  return {
    labels,
    datasets: [{
      label: `Promedio por hora`,
      data,
      backgroundColor: borderColor,
      borderColor: borderColor,
      borderWidth: 0
    }]
  }
})

// Comparación entre activos
const assetComparisonData = computed(() => {
  const labels = assets.value.map(asset => asset.name.substring(0, 15) + '...')
  const data = assets.value.map(asset => {
    if (assetsData.value[asset.id] && assetsData.value[asset.id][selectedVariable.value]) {
      const assetData = assetsData.value[asset.id][selectedVariable.value]
      const values = assetData.map(d => d.value)
      return values.reduce((a, b) => a + b, 0) / values.length
    }
    return 0
  })

  let borderColor = '#3b82f6'
  let backgroundColor = 'rgba(59, 130, 246, 0.2)'
  
  if (selectedVariable.value === 'temperature') {
    borderColor = '#ef4444'
    backgroundColor = 'rgba(239, 68, 68, 0.2)'
  } else if (selectedVariable.value === 'humidity') {
    borderColor = '#06b6d4'
    backgroundColor = 'rgba(6, 182, 212, 0.2)'
  } else if (selectedVariable.value === 'consumption') {
    borderColor = '#f59e0b'
    backgroundColor = 'rgba(245, 158, 11, 0.2)'
  }

  return {
    labels,
    datasets: [{
      label: variableLabel.value,
      data,
      borderColor,
      backgroundColor,
      borderWidth: 2,
      pointBackgroundColor: borderColor,
      pointBorderColor: borderColor,
      pointHoverBackgroundColor: borderColor,
      pointHoverBorderColor: borderColor
    }]
  }
})

// Opciones de gráficos
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: darkMode.value ? '#1f2937' : '#ffffff',
      titleColor: darkMode.value ? '#f9fafb' : '#111827',
      bodyColor: darkMode.value ? '#f9fafb' : '#111827',
      borderColor: darkMode.value ? '#374151' : '#e5e7eb',
      borderWidth: 1
    }
  },
  scales: {
    x: {
      display: true,
      grid: {
        color: darkMode.value ? '#374151' : '#f3f4f6'
      },
      ticks: {
        color: darkMode.value ? '#9ca3af' : '#6b7280'
      }
    },
    y: {
      display: true,
      grid: {
        color: darkMode.value ? '#374151' : '#f3f4f6'
      },
      ticks: {
        color: darkMode.value ? '#9ca3af' : '#6b7280'
      }
    }
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false
  }
}))

const barChartOptions = computed(() => ({
  ...chartOptions.value,
  plugins: {
    ...chartOptions.value.plugins,
    legend: {
      display: false
    }
  }
}))

const radarChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: darkMode.value ? '#1f2937' : '#ffffff',
      titleColor: darkMode.value ? '#f9fafb' : '#111827',
      bodyColor: darkMode.value ? '#f9fafb' : '#111827',
      borderColor: darkMode.value ? '#374151' : '#e5e7eb',
      borderWidth: 1
    }
  },
  scales: {
    r: {
      angleLines: {
        color: darkMode.value ? '#374151' : '#f3f4f6'
      },
      grid: {
        color: darkMode.value ? '#374151' : '#f3f4f6'
      },
      pointLabels: {
        color: darkMode.value ? '#9ca3af' : '#6b7280'
      },
      ticks: {
        color: darkMode.value ? '#9ca3af' : '#6b7280',
        backdropColor: 'transparent'
      }
    }
  }
}))
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  transition: all 0.3s ease;
}

.dashboard.dark-mode {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

.main-content {
  margin-left: 250px;
  padding: 0;
  transition: margin-left 0.3s ease;
}

/* Header Styles */
.charts-header {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.dark-mode .charts-header {
  background: rgba(30, 41, 59, 0.9);
  border: 1px solid rgba(71, 85, 105, 0.3);
}

.header-content h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.dark-mode .header-content h1 {
  color: #f1f5f9;
}

.charts-subtitle {
  color: #64748b;
  font-size: 1.1rem;
  margin: 0;
}

.dark-mode .charts-subtitle {
  color: #94a3b8;
}

.selected-asset {
  color: #3b82f6;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 2rem;
  margin-top: 1.5rem;
}

.variable-filters {
  display: flex;
  gap: 0.5rem;
}

.variable-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e2e8f0;
  background: white;
  color: #64748b;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
}

.variable-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  transform: translateY(-2px);
}

.variable-btn.active {
  border-color: #3b82f6;
  background: #3b82f6;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.dark-mode .variable-btn {
  background: #334155;
  border-color: #475569;
  color: #cbd5e1;
}

.dark-mode .variable-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.time-filters {
  display: flex;
  gap: 0.25rem;
  background: #f1f5f9;
  padding: 0.25rem;
  border-radius: 12px;
}

.dark-mode .time-filters {
  background: #334155;
}

.time-filter-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  color: #64748b;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
}

.time-filter-btn:hover {
  background: white;
  color: #1e293b;
}

.time-filter-btn.active {
  background: white;
  color: #3b82f6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dark-mode .time-filter-btn:hover {
  background: #475569;
  color: #f1f5f9;
}

.dark-mode .time-filter-btn.active {
  background: #475569;
  color: #3b82f6;
}

/* Stats Cards */
.temp-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.temp-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.dark-mode .temp-card {
  background: rgba(30, 41, 59, 0.9);
  border: 1px solid rgba(71, 85, 105, 0.3);
}

.temp-card-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.temp-card.current .temp-card-icon {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.temp-card.average .temp-card-icon {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
}

.temp-card.max .temp-card-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.temp-card.min .temp-card-icon {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: white;
}

.temp-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.dark-mode .temp-value {
  color: #f1f5f9;
}

.temp-label {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
  font-weight: 500;
}

.dark-mode .temp-label {
  color: #94a3b8;
}

.temp-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  margin-top: 0.5rem;
}

.temp-trend.up {
  color: #059669;
}

.temp-trend.down {
  color: #dc2626;
}

.temp-time {
  color: #64748b;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.dark-mode .temp-time {
  color: #94a3b8;
}

/* Chart Container */
.chart-container {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.dark-mode .chart-container {
  background: rgba(30, 41, 59, 0.9);
  border: 1px solid rgba(71, 85, 105, 0.3);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.chart-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.dark-mode .chart-title {
  color: #f1f5f9;
}

.chart-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.asset-select {
  min-width: 200px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.5rem;
  background: white;
}

.dark-mode .asset-select {
  background: #334155;
  border-color: #475569;
  color: #f1f5f9;
}

.chart-type-toggle {
  display: flex;
  gap: 0.25rem;
  background: #f1f5f9;
  padding: 0.25rem;
  border-radius: 8px;
}

.dark-mode .chart-type-toggle {
  background: #334155;
}

.chart-type-btn {
  padding: 0.5rem;
  border: none;
  background: transparent;
  color: #64748b;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chart-type-btn:hover {
  background: white;
  color: #1e293b;
}

.chart-type-btn.active {
  background: white;
  color: #3b82f6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dark-mode .chart-type-btn:hover {
  background: #475569;
  color: #f1f5f9;
}

.dark-mode .chart-type-btn.active {
  background: #475569;
  color: #3b82f6;
}

.chart-wrapper {
  height: 400px;
  position: relative;
}

/* Assets Grid */
.assets-status-container {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.dark-mode .assets-status-container {
  background: rgba(30, 41, 59, 0.9);
  border: 1px solid rgba(71, 85, 105, 0.3);
}

.assets-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

.dark-mode .assets-title {
  color: #f1f5f9;
}

.assets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.asset-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.asset-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.asset-card.active {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.asset-card.good {
  border-left: 4px solid #10b981;
}

.asset-card.warning {
  border-left: 4px solid #f59e0b;
}

.asset-card.critical {
  border-left: 4px solid #ef4444;
}

.dark-mode .asset-card {
  background: #334155;
  border-color: #475569;
}

.asset-status-indicator {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-dot.good {
  background: #10b981;
}

.status-dot.warning {
  background: #f59e0b;
}

.status-dot.critical {
  background: #ef4444;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.asset-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.dark-mode .asset-name {
  color: #f1f5f9;
}

.asset-sector {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.dark-mode .asset-sector {
  color: #94a3b8;
}

.asset-metrics {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.metric {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  color: #475569;
  font-weight: 500;
}

.dark-mode .metric {
  color: #cbd5e1;
}

/* Alerts */
.alerts-container {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.dark-mode .alerts-container {
  background: rgba(30, 41, 59, 0.9);
  border: 1px solid rgba(71, 85, 105, 0.3);
}

.alerts-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #dc2626;
  margin-bottom: 1.5rem;
}

.dark-mode .alerts-title {
  color: #fca5a5;
}

.alerts-grid {
  display: grid;
  gap: 1rem;
}

.alert-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-left: 4px solid #dc2626;
}

.alert-card.warning {
  border-left-color: #f59e0b;
}

.alert-card.critical {
  border-left-color: #dc2626;
}

.dark-mode .alert-card {
  background: #334155;
}

.alert-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.alert-card.warning .alert-icon {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.alert-card.critical .alert-icon {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.dark-mode .alert-title {
  color: #f1f5f9;
}

.alert-description {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.dark-mode .alert-description {
  color: #94a3b8;
}

.alert-time {
  color: #64748b;
  font-size: 0.8rem;
}

.dark-mode .alert-time {
  color: #94a3b8;
}

.alert-temp {
  font-size: 1.5rem;
  font-weight: 700;
  color: #dc2626;
}

.alert-card.warning .alert-temp {
  color: #f59e0b;
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
  
  .header-actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .variable-filters {
    flex-wrap: wrap;
  }
  
  .chart-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .chart-controls {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .assets-grid {
    grid-template-columns: 1fr;
  }
  
  .asset-metrics {
    justify-content: space-between;
  }
}
</style>