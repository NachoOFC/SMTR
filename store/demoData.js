import { reactive, watch } from 'vue';

// Datos de ejemplo para demo (solo en memoria si localStorage está vacío)
const initialHistorial = [
  {
    id: 1,
    text: 'Tablero General de Distribución: 102.29 kWh',
    level: 'Crítico',
    levelText: 'Crítico',
    location: 'Planta Principal - Sector A',
    currentValue: '102.29 kWh',
    threshold: 'N/A',
    estado: 'Pendiente',
    fecha: '2025-06-24T12:00:00Z'
  },
  {
    id: 2,
    text: 'Motor Principal: 88°C',
    level: 'Precaución',
    levelText: 'Precaución',
    location: 'Subsuelo',
    currentValue: '88°C',
    threshold: '80°C',
    estado: 'Resuelta',
    fecha: '2025-06-23T09:30:00Z'
  },
  {
    id: 3,
    text: 'Sensor de Vibración: 9000 rpm',
    level: 'Crítico',
    levelText: 'Crítico',
    location: 'Torre Norte',
    currentValue: '9000 rpm',
    threshold: '7000 rpm',
    estado: 'Pendiente',
    fecha: '2025-06-22T15:45:00Z'
  },
  {
    id: 4,
    text: 'Panel Solar: 0 kWh',
    level: 'Precaución',
    levelText: 'Precaución',
    location: 'Techo',
    currentValue: '0 kWh',
    threshold: '10 kWh',
    estado: 'Pendiente',
    fecha: '2025-06-21T12:00:00Z'
  },
  {
    id: 5,
    text: 'Alarma de Café: Sin café en la sala',
    level: 'Crítico',
    levelText: 'Crítico',
    location: 'Sala de descanso',
    currentValue: '0 tazas',
    threshold: '1 taza',
    estado: 'Pendiente',
    fecha: '2025-06-20T08:00:00Z'
  }
];
const initialReportes = [
  {
    id: 1,
    asunto: 'Ayuda',
    descripcion: 'La temperatura arde como tu hermana',
    alerta: { ...initialHistorial[0] },
    fecha: '2025-06-24T12:00:00Z'
  },
  {
    id: 2,
    asunto: 'Motor hace ruidos raros',
    descripcion: 'Suena como si estuviera rapeando Eminem',
    alerta: { ...initialHistorial[1] },
    fecha: '2025-06-23T09:35:00Z'
  },
  {
    id: 3,
    asunto: 'Vibración extrema',
    descripcion: 'Parece que va a despegar la torre, Houston tenemos un problema',
    alerta: { ...initialHistorial[2] },
    fecha: '2025-06-22T15:50:00Z'
  },
  {
    id: 4,
    asunto: 'Panel solar flojo',
    descripcion: 'No genera ni para cargar el celular',
    alerta: { ...initialHistorial[3] },
    fecha: '2025-06-21T12:10:00Z'
  },
  {
    id: 5,
    asunto: '¡Sin café!',
    descripcion: 'Emergencia real, la productividad caerá a cero',
    alerta: { ...initialHistorial[4] },
    fecha: '2025-06-20T08:05:00Z'
  }
];
const initialSolicitudes = [
  {
    id: 1,
    mensaje: 'Por favor revisar el tablero principal, está en crítico.',
    alerta: initialHistorial[0],
    fecha: '2025-06-24T12:00:00Z',
    estado: 'Pendiente'
  },
  {
    id: 2,
    mensaje: 'El motor hace más ruido que mi suegra enojada.',
    alerta: initialHistorial[1],
    fecha: '2025-06-23T09:40:00Z',
    estado: 'Pendiente'
  },
  {
    id: 3,
    mensaje: '¿Es normal que la torre vibre como un celular en modo fiesta?',
    alerta: initialHistorial[2],
    fecha: '2025-06-22T15:55:00Z',
    estado: 'Pendiente'
  },
  {
    id: 4,
    mensaje: 'Panel solar necesita vacaciones, no produce nada.',
    alerta: initialHistorial[3],
    fecha: '2025-06-21T12:15:00Z',
    estado: 'Pendiente'
  },
  {
    id: 5,
    mensaje: '¡Sin café! Esto sí es una alerta crítica.',
    alerta: initialHistorial[4],
    fecha: '2025-06-20T08:10:00Z',
    estado: 'Pendiente'
  }
];

const isClient = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

function loadHybrid(key, initial) {
  if (!isClient) return JSON.parse(JSON.stringify(initial));
  try {
    const data = localStorage.getItem(key);
    if (data) {
      const parsed = JSON.parse(data);
      // Si el array está vacío, usar los datos iniciales
      if (Array.isArray(parsed) && parsed.length === 0) {
        return JSON.parse(JSON.stringify(initial));
      }
      return parsed;
    }
    return JSON.parse(JSON.stringify(initial));
  } catch {
    return JSON.parse(JSON.stringify(initial));
  }
}

export const demoData = reactive({
  historial: loadHybrid('smtr_historial', initialHistorial),
  reportes: loadHybrid('smtr_reportes', initialReportes),
  solicitudes: loadHybrid('smtr_solicitudes', initialSolicitudes),
  modo: isClient && localStorage.getItem('smtr_modo') ? JSON.parse(localStorage.getItem('smtr_modo')) : 'usuario'
});

if (isClient) {
  watch(
    () => demoData.historial,
    (val) => {
      localStorage.setItem('smtr_historial', JSON.stringify(val));
    },
    { deep: true }
  );

  watch(
    () => demoData.reportes,
    (val) => {
      localStorage.setItem('smtr_reportes', JSON.stringify(val));
    },
    { deep: true }
  );

  watch(
    () => demoData.solicitudes,
    (val) => {
      localStorage.setItem('smtr_solicitudes', JSON.stringify(val));
    },
    { deep: true }
  );

  watch(
    () => demoData.modo,
    (val) => {
      localStorage.setItem('smtr_modo', JSON.stringify(val));
    }
  );
}

export function toggleModo() {
  demoData.modo = demoData.modo === 'usuario' ? 'tecnico' : 'usuario';
} 