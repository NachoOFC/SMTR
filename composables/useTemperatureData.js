import { ref, computed } from 'vue'

export const useTemperatureData = () => {
  const currentTemperature = ref(24.5)
  const currentHumidity = ref(40.0)
  const currentConsumption = ref(90.0)
  const temperatureHistory = ref([])
  const humidityHistory = ref([])
  const consumptionHistory = ref([])
  const selectedTimeframe = ref('24h')
  const selectedSensor = ref('')
  const selectedVariable = ref('temperature') // 'temperature', 'humidity', 'consumption'

  // Simular datos de temperatura realistas
  const generateTemperatureData = (hours = 24, baseTemp = 24) => {
    const data = []
    const now = new Date()
    for (let i = hours - 1; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000)
      const hour = time.getHours()
      let temp = baseTemp
      if (hour >= 6 && hour <= 18) {
        const dayProgress = (hour - 6) / 12
        temp += Math.sin(dayProgress * Math.PI) * 6
      } else {
        temp -= 3
      }
      temp += (Math.random() - 0.5) * 2
      temp += Math.sin(i * 0.1) * 0.5
      data.push({
        time: time.toISOString(),
        value: Math.round(temp * 10) / 10,
        timestamp: time.getTime()
      })
    }
    return data
  }

  // Simular datos de humedad
  const generateHumidityData = (hours = 24, baseHum = 40) => {
    const data = []
    const now = new Date()
    for (let i = hours - 1; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000)
      let hum = baseHum + Math.sin(i * 0.2) * 5 + (Math.random() - 0.5) * 2
      data.push({
        time: time.toISOString(),
        value: Math.round(hum * 100) / 100,
        timestamp: time.getTime()
      })
    }
    return data
  }

  // Simular datos de consumo
  const generateConsumptionData = (hours = 24, baseCons = 90) => {
    const data = []
    const now = new Date()
    for (let i = hours - 1; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000)
      let cons = baseCons + Math.sin(i * 0.15) * 15 + (Math.random() - 0.5) * 5
      data.push({
        time: time.toISOString(),
        value: Math.round(cons * 100) / 100,
        timestamp: time.getTime()
      })
    }
    return data
  }

  // Generar datos por diferentes períodos
  const getDataByVariable = (variable, timeframe) => {
    switch (variable) {
      case 'temperature':
        return generateTemperatureData(getHours(timeframe), currentTemperature.value)
      case 'humidity':
        return generateHumidityData(getHours(timeframe), currentHumidity.value)
      case 'consumption':
        return generateConsumptionData(getHours(timeframe), currentConsumption.value)
      default:
        return []
    }
  }

  function getHours(timeframe) {
    switch (timeframe) {
      case '1h': return 1
      case '24h': return 24
      case '7d': return 24 * 7
      case '30d': return 24 * 30
      default: return 24
    }
  }

  // Estadísticas genéricas
  function getStats(history, current) {
    if (!history.length) return null
    const vals = history.map(d => d.value)
    const max = Math.max(...vals)
    const min = Math.min(...vals)
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length
    const maxData = history.find(d => d.value === max)
    const minData = history.find(d => d.value === min)
    return {
      current,
      average: Math.round(avg * 100) / 100,
      maximum: max,
      minimum: min,
      maxTime: maxData ? new Date(maxData.time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '',
      minTime: minData ? new Date(minData.time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '',
      change: Math.round((current - avg) * 100) / 100,
      trend: current > avg ? 'up' : 'down'
    }
  }

  const temperatureStats = computed(() => getStats(temperatureHistory.value, currentTemperature.value))
  const humidityStats = computed(() => getStats(humidityHistory.value, currentHumidity.value))
  const consumptionStats = computed(() => getStats(consumptionHistory.value, currentConsumption.value))

  // Actualizar datos en tiempo real
  const updateData = () => {
    currentTemperature.value += (Math.random() - 0.5) * 0.5
    currentHumidity.value += (Math.random() - 0.5) * 0.2
    currentConsumption.value += (Math.random() - 0.5) * 1
    currentTemperature.value = Math.round(currentTemperature.value * 10) / 10
    currentHumidity.value = Math.round(currentHumidity.value * 100) / 100
    currentConsumption.value = Math.round(currentConsumption.value * 100) / 100
    temperatureHistory.value.push({
      time: new Date().toISOString(),
      value: currentTemperature.value,
      timestamp: Date.now()
    })
    humidityHistory.value.push({
      time: new Date().toISOString(),
      value: currentHumidity.value,
      timestamp: Date.now()
    })
    consumptionHistory.value.push({
      time: new Date().toISOString(),
      value: currentConsumption.value,
      timestamp: Date.now()
    })
    if (temperatureHistory.value.length > 1000) temperatureHistory.value = temperatureHistory.value.slice(-1000)
    if (humidityHistory.value.length > 1000) humidityHistory.value = humidityHistory.value.slice(-1000)
    if (consumptionHistory.value.length > 1000) consumptionHistory.value = consumptionHistory.value.slice(-1000)
  }

  // Inicializar datos
  const initializeData = () => {
    temperatureHistory.value = generateTemperatureData(getHours(selectedTimeframe.value), currentTemperature.value)
    humidityHistory.value = generateHumidityData(getHours(selectedTimeframe.value), currentHumidity.value)
    consumptionHistory.value = generateConsumptionData(getHours(selectedTimeframe.value), currentConsumption.value)
    setInterval(updateData, 30000)
  }

  // Cambiar período de tiempo o variable
  const changeTimeframe = (timeframe) => {
    selectedTimeframe.value = timeframe
    temperatureHistory.value = generateTemperatureData(getHours(timeframe), currentTemperature.value)
    humidityHistory.value = generateHumidityData(getHours(timeframe), currentHumidity.value)
    consumptionHistory.value = generateConsumptionData(getHours(timeframe), currentConsumption.value)
  }
  const changeVariable = (variable) => {
    selectedVariable.value = variable
  }

  // Para gráficos
  const getHistory = computed(() => {
    switch (selectedVariable.value) {
      case 'temperature': return temperatureHistory.value
      case 'humidity': return humidityHistory.value
      case 'consumption': return consumptionHistory.value
      default: return temperatureHistory.value
    }
  })
  const getStatsByVariable = computed(() => {
    switch (selectedVariable.value) {
      case 'temperature': return temperatureStats.value
      case 'humidity': return humidityStats.value
      case 'consumption': return consumptionStats.value
      default: return temperatureStats.value
    }
  })

  return {
    currentTemperature,
    currentHumidity,
    currentConsumption,
    temperatureHistory,
    humidityHistory,
    consumptionHistory,
    selectedTimeframe,
    selectedVariable,
    temperatureStats,
    humidityStats,
    consumptionStats,
    getHistory,
    getStatsByVariable,
    getDataByVariable,
    initializeData,
    changeTimeframe,
    changeVariable
  }
} 