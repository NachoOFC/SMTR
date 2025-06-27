import { ref, computed } from 'vue'

export const useTemperatureData = () => {
  // Definir los 7 activos del sistema
  const assets = ref([
    {
      id: 'tgd-1',
      name: 'Tablero General de Distribución',
      sector: 'Planta Principal - Sector A',
      type: 'electrical',
      status: 'critical',
      baseTemp: 102.29,
      baseHumidity: 45.0,
      baseConsumption: 150.0
    },
    {
      id: 'bbu-1',
      name: 'Banco de Baterías de UPS',
      sector: 'Edificio Central - Sala Servidores',
      type: 'ups',
      status: 'good',
      baseTemp: 28.5,
      baseHumidity: 38.0,
      baseConsumption: 85.0
    },
    {
      id: 'mpe-1',
      name: 'Motor de Portón Eléctrico',
      sector: 'Condominio Los Pinos - Acceso Principal',
      type: 'motor',
      status: 'good',
      baseTemp: 35.2,
      baseHumidity: 42.0,
      baseConsumption: 45.0
    },
    {
      id: 'tgd-2',
      name: 'Tablero General de Distribución',
      sector: 'Oficina Motriz - Piso 3',
      type: 'electrical',
      status: 'warning',
      baseTemp: 93.89,
      baseHumidity: 40.5,
      baseConsumption: 120.0
    },
    {
      id: 'bbu-2',
      name: 'Banco de Baterías de UPS',
      sector: 'Planta Principal - Sector B - Sala Control',
      type: 'ups',
      status: 'good',
      baseTemp: 30.1,
      baseHumidity: 35.8,
      baseConsumption: 92.0
    },
    {
      id: 'lamp-1',
      name: 'Lampara',
      sector: 'Conjunto los Lagos',
      type: 'lighting',
      status: 'good',
      baseTemp: 32.5,
      baseHumidity: 48.0,
      baseConsumption: 25.0
    },
    {
      id: 'motor-1',
      name: 'Motor Eléctrico Muy Bueno',
      sector: 'Santiago de Chile',
      type: 'motor',
      status: 'warning',
      baseTemp: 100.0,
      baseHumidity: 44.0,
      baseConsumption: 180.0
    }
  ])

  // Estados reactivos
  const selectedTimeframe = ref('24h')
  const selectedAsset = ref('') // '' = todos los sensores
  const selectedVariable = ref('temperature')
  
  // Datos históricos por activo
  const assetsData = ref({})

  // Generar datos realistas por activo y variable
  const generateAssetData = (asset, variable, hours = 24) => {
    const data = []
    const now = new Date()
    let baseValue = 0
    let variance = 0
    let dayPattern = false

    // Configurar valores base según la variable y activo
    switch (variable) {
      case 'temperature':
        baseValue = asset.baseTemp
        variance = asset.type === 'electrical' ? 8 : 3
        dayPattern = true
        break
      case 'humidity':
        baseValue = asset.baseHumidity
        variance = 5
        dayPattern = false
        break
      case 'consumption':
        baseValue = asset.baseConsumption
        variance = asset.type === 'electrical' ? 20 : 10
        dayPattern = true
        break
    }

    for (let i = hours - 1; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000)
      const hour = time.getHours()
      let value = baseValue

      // Patrón diario para temperatura y consumo
      if (dayPattern) {
        if (hour >= 6 && hour <= 18) {
          const dayProgress = (hour - 6) / 12
          const dayEffect = Math.sin(dayProgress * Math.PI) * (variance * 0.3)
          value += dayEffect
        } else {
          value -= variance * 0.2
        }
      }

      // Ruido aleatorio
      value += (Math.random() - 0.5) * variance * 0.4
      
      // Tendencia senoidal suave
      value += Math.sin(i * 0.1) * (variance * 0.1)

      // Efectos específicos por tipo de activo
      if (asset.type === 'electrical' && variable === 'temperature') {
        // Los tableros eléctricos tienen picos más pronunciados
        if (Math.random() < 0.1) value += variance * 0.5
      }

      // Redondear según la variable
      const decimals = variable === 'temperature' ? 1 : 2
      value = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)

      data.push({
        time: time.toISOString(),
        value: Math.max(0, value), // Evitar valores negativos
        timestamp: time.getTime(),
        assetId: asset.id,
        variable: variable
      })
    }

    return data
  }

  // Obtener horas según el timeframe
  const getHours = (timeframe) => {
    switch (timeframe) {
      case '1h': return 1
      case '24h': return 24
      case '7d': return 24 * 7
      case '30d': return 24 * 30
      case '1m': return 24 * 30
      default: return 24
    }
  }

  // Inicializar datos para todos los activos
  const initializeData = () => {
    const hours = getHours(selectedTimeframe.value)
    const variables = ['temperature', 'humidity', 'consumption']
    
    assets.value.forEach(asset => {
      if (!assetsData.value[asset.id]) {
        assetsData.value[asset.id] = {}
      }
      
      variables.forEach(variable => {
        assetsData.value[asset.id][variable] = generateAssetData(asset, variable, hours)
      })
    })

    // Actualizar datos cada 30 segundos
    setInterval(updateRealTimeData, 30000)
  }

  // Actualizar datos en tiempo real
  const updateRealTimeData = () => {
    const now = new Date()
    const variables = ['temperature', 'humidity', 'consumption']
    
    assets.value.forEach(asset => {
      variables.forEach(variable => {
        if (!assetsData.value[asset.id] || !assetsData.value[asset.id][variable]) return
        
        const lastData = assetsData.value[asset.id][variable].slice(-1)[0]
        if (!lastData) return

        let newValue = lastData.value
        const variance = variable === 'temperature' ? 0.5 : 0.2
        newValue += (Math.random() - 0.5) * variance

        // Mantener en rangos razonables
        const decimals = variable === 'temperature' ? 1 : 2
        newValue = Math.round(newValue * Math.pow(10, decimals)) / Math.pow(10, decimals)
        newValue = Math.max(0, newValue)

        const newDataPoint = {
          time: now.toISOString(),
          value: newValue,
          timestamp: now.getTime(),
          assetId: asset.id,
          variable: variable
        }

        assetsData.value[asset.id][variable].push(newDataPoint)
        
        // Mantener solo los últimos 1000 puntos
        if (assetsData.value[asset.id][variable].length > 1000) {
          assetsData.value[asset.id][variable] = assetsData.value[asset.id][variable].slice(-1000)
        }
      })
    })
  }

  // Cambiar timeframe
  const changeTimeframe = (timeframe) => {
    selectedTimeframe.value = timeframe
    const hours = getHours(timeframe)
    const variables = ['temperature', 'humidity', 'consumption']
    
    assets.value.forEach(asset => {
      variables.forEach(variable => {
        assetsData.value[asset.id][variable] = generateAssetData(asset, variable, hours)
      })
    })
  }

  // Cambiar variable
  const changeVariable = (variable) => {
    selectedVariable.value = variable
  }

  // Obtener datos históricos filtrados
  const getHistory = computed(() => {
    if (!selectedAsset.value) {
      // Todos los sensores - combinar datos de todos los activos
      const combinedData = []
      assets.value.forEach(asset => {
        if (assetsData.value[asset.id] && assetsData.value[asset.id][selectedVariable.value]) {
          combinedData.push(...assetsData.value[asset.id][selectedVariable.value])
        }
      })
      
      // Ordenar por timestamp y agrupar por tiempo para promediar
      combinedData.sort((a, b) => a.timestamp - b.timestamp)
      
      // Crear puntos promediados por hora
      const groupedData = {}
      combinedData.forEach(point => {
        const hourKey = Math.floor(point.timestamp / (60 * 60 * 1000)) * (60 * 60 * 1000)
        if (!groupedData[hourKey]) {
          groupedData[hourKey] = { values: [], time: new Date(hourKey).toISOString() }
        }
        groupedData[hourKey].values.push(point.value)
      })
      
      return Object.values(groupedData).map(group => ({
        time: group.time,
        value: group.values.reduce((a, b) => a + b, 0) / group.values.length,
        timestamp: new Date(group.time).getTime()
      }))
    } else {
      // Sensor específico
      if (assetsData.value[selectedAsset.value] && assetsData.value[selectedAsset.value][selectedVariable.value]) {
        return assetsData.value[selectedAsset.value][selectedVariable.value]
      }
      return []
    }
  })

  // Calcular estadísticas
  const getStatsByVariable = computed(() => {
    const history = getHistory.value
    if (!history.length) return null

    const values = history.map(d => d.value)
    const current = values[values.length - 1] || 0
    const max = Math.max(...values)
    const min = Math.min(...values)
    const avg = values.reduce((a, b) => a + b, 0) / values.length

    const maxData = history.find(d => d.value === max)
    const minData = history.find(d => d.value === min)

    return {
      current: Math.round(current * 100) / 100,
      average: Math.round(avg * 100) / 100,
      maximum: Math.round(max * 100) / 100,
      minimum: Math.round(min * 100) / 100,
      maxTime: maxData ? new Date(maxData.time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '',
      minTime: minData ? new Date(minData.time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '',
      change: Math.round((current - avg) * 100) / 100,
      trend: current > avg ? 'up' : 'down'
    }
  })

  // Obtener alertas de temperatura
  const getTemperatureAlerts = computed(() => {
    const alerts = []
    assets.value.forEach(asset => {
      if (assetsData.value[asset.id] && assetsData.value[asset.id].temperature) {
        const tempData = assetsData.value[asset.id].temperature
        const currentTemp = tempData[tempData.length - 1]?.value || 0
        
        if (currentTemp > 80) {
          alerts.push({
            id: `alert-${asset.id}`,
            level: currentTemp > 100 ? 'critical' : 'warning',
            title: `Temperatura elevada en ${asset.name}`,
            description: `Sensor ubicado en ${asset.sector}`,
            temperature: Math.round(currentTemp * 10) / 10,
            time: 'Hace 2 minutos',
            icon: currentTemp > 100 ? 'bi bi-exclamation-triangle-fill' : 'bi bi-exclamation-triangle'
          })
        }
      }
    })
    return alerts
  })

  // Guardar en localStorage
  const saveToLocalStorage = () => {
    const dataToSave = {
      assets: assets.value,
      assetsData: assetsData.value,
      selectedTimeframe: selectedTimeframe.value,
      selectedVariable: selectedVariable.value,
      lastUpdate: new Date().toISOString()
    }
    localStorage.setItem('temperatureSystemData', JSON.stringify(dataToSave))
  }

  // Cargar desde localStorage
  const loadFromLocalStorage = () => {
    const savedData = localStorage.getItem('temperatureSystemData')
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        if (parsed.assets) assets.value = parsed.assets
        if (parsed.assetsData) assetsData.value = parsed.assetsData
        if (parsed.selectedTimeframe) selectedTimeframe.value = parsed.selectedTimeframe
        if (parsed.selectedVariable) selectedVariable.value = parsed.selectedVariable
        return true
      } catch (error) {
        console.error('Error loading from localStorage:', error)
        return false
      }
    }
    return false
  }

  return {
    // Estados
    assets,
    selectedTimeframe,
    selectedAsset,
    selectedVariable,
    assetsData,
    
    // Datos computados
    getHistory,
    getStatsByVariable,
    getTemperatureAlerts,
    
    // Métodos
    initializeData,
    changeTimeframe,
    changeVariable,
    saveToLocalStorage,
    loadFromLocalStorage,
    
    // Métodos de utilidad
    getHours,
    generateAssetData
  }
}