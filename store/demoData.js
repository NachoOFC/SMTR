import { reactive, watch } from 'vue';

function load(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

export const demoData = reactive({
  historial: load('smtr_historial', []),
  reportes: load('smtr_reportes', []),
  solicitudes: load('smtr_solicitudes', []),
  modo: load('smtr_modo', 'usuario'), // 'usuario' o 'tecnico'
});

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

export function toggleModo() {
  demoData.modo = demoData.modo === 'usuario' ? 'tecnico' : 'usuario';
} 