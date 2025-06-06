<template>
  <section :class="['alert-panel', darkMode ? 'dark-theme' : 'light-theme']">
    <header class="panel-header">
      <h3 class="title">
        <i class="bi bi-activity me-2"></i> Monitor de Alertas
      </h3>
      <span class="badge total">{{ alerts.length }}</span>
    </header>

    <div class="alert-body">
      <transition-group name="fade" tag="div">
        <div
          v-for="alert in alerts"
          :key="alert.id"
          class="alert-box"
          :class="{
            'alert-critical': alert.level === 'Crítico',
            'alert-warning': alert.level === 'Precaución',
          }"
        >
          <i
            class="bi me-2"
            :class="{
              'bi-x-octagon-fill': alert.level === 'Crítico',
              'bi-exclamation-circle-fill': alert.level === 'Precaución',
            }"
          ></i>
          <span class="alert-text">{{ alert.levelText }} - {{ alert.text }}</span>
          <div class="alert-details">
            <div><strong>Ubicación:</strong> {{ alert.location }}</div>
            <div><strong>Valor Actual:</strong> {{ alert.currentValue }}</div>
          </div>
          <div class="alert-actions">
            <button class="btn-report" @click="handleReport(alert)">Generar Reporte</button>
            <button class="btn-resolved" @click="handleResolve(alert)">Marcar como Resuelta</button>
            <button class="btn-pending" @click="handlePending(alert)">Marcar Pendiente</button>
            <button class="btn-tech" @click="handleTech(alert)">Avisar a Tecnico</button>
          </div>
        </div>
      </transition-group>

      <div v-if="alerts.length === 0" class="empty-message">
        <i class="bi bi-check-circle me-2"></i> Sistema sin alertas
      </div>
    </div>

    <!-- Modales -->
    <AlertModal
      :show="showReportModal"
      title="Generar Reporte"
      confirmButtonText="Generar"
      @close="closeModals"
      @confirm="generateReport"
    >
      <p>¿Desea generar un reporte detallado para esta alerta?</p>
    </AlertModal>

    <AlertModal
      :show="showResolveModal"
      title="Marcar como Resuelta"
      confirmButtonText="Confirmar"
      @close="closeModals"
      @confirm="resolveAlert"
    >
      <p>¿Está seguro de marcar esta alerta como resuelta?</p>
      <div class="form-group mt-3">
        <label>Nuevo valor:</label>
        <input type="text" v-model="newValue" class="form-control" placeholder="Ingrese el nuevo valor">
      </div>
    </AlertModal>

    <AlertModal
      :show="showPendingModal"
      title="Marcar como Pendiente"
      confirmButtonText="Confirmar"
      @close="closeModals"
      @confirm="markAsPending"
    >
      <p>¿Desea marcar esta alerta como pendiente?</p>
    </AlertModal>

    <AlertModal
      :show="showTechModal"
      title="Avisar a Técnico"
      confirmButtonText="Enviar"
      @close="closeModals"
      @confirm="notifyTech"
    >
      <p>¿Desea enviar una notificación al técnico sobre esta alerta?</p>
    </AlertModal>
  </section>
</template>

<script>
import { useAssets } from '~/composables/useAssets';
import AlertModal from './AlertModal.vue';
import { ref } from 'vue';

export default {
  components: {
    AlertModal
  },

  props: {
    darkMode: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      assets: [],
      showReportModal: false,
      showResolveModal: false,
      showPendingModal: false,
      showTechModal: false,
      selectedAlert: null,
      newValue: ''
    };
  },

  computed: {
    alerts() {
      return this.assets
        .filter(
          (asset) => asset.status === "Crítico" || asset.status === "Precaución"
        )
        .map((asset) => ({
          id: asset.id,
          text: `${asset.name}: ${asset.value}`,
          level: asset.status,
          levelText: asset.status,
          location: asset.sector || 'N/A',
          currentValue: asset.value || 'N/A',
          threshold: 'N/A'
        }));
    },
  },

  mounted() {
    const { fetchAssets } = useAssets();
    fetchAssets((loadedAssets) => {
      this.assets = loadedAssets;
    });
  },

  methods: {
    handleReport(alert) {
      this.selectedAlert = alert;
      this.showReportModal = true;
    },

    handleResolve(alert) {
      this.selectedAlert = alert;
      this.showResolveModal = true;
    },

    handlePending(alert) {
      this.selectedAlert = alert;
      this.showPendingModal = true;
    },

    handleTech(alert) {
      this.selectedAlert = alert;
      this.showTechModal = true;
    },

    closeModals() {
      this.showReportModal = false;
      this.showResolveModal = false;
      this.showPendingModal = false;
      this.showTechModal = false;
      this.selectedAlert = null;
      this.newValue = '';
    },

    async generateReport() {
      // Implementar generación de reporte
      console.log('Generando reporte para:', this.selectedAlert);
    },

    async resolveAlert() {
      if (!this.newValue) {
        alert('Por favor ingrese un nuevo valor');
        return;
      }

      try {
        const { updateAssetStatus } = useAssets();
        await updateAssetStatus(this.selectedAlert.id, {
          status: 'Bueno',
          value: this.newValue
        });
        
        // Actualizar la lista de activos
        const { fetchAssets } = useAssets();
        fetchAssets((loadedAssets) => {
          this.assets = loadedAssets;
        });

        // Mostrar mensaje de éxito
        alert('Alerta marcada como resuelta correctamente');
      } catch (error) {
        console.error('Error al resolver alerta:', error);
        alert('Error al resolver la alerta: ' + error.message);
      }
    },

    async markAsPending() {
      try {
        const { updateAssetStatus } = useAssets();
        await updateAssetStatus(this.selectedAlert.id, {
          status: 'Pendiente'
        });
        
        // Actualizar la lista de activos
        const { fetchAssets } = useAssets();
        fetchAssets((loadedAssets) => {
          this.assets = loadedAssets;
        });

        // Mostrar mensaje de éxito
        alert('Alerta marcada como pendiente correctamente');
      } catch (error) {
        console.error('Error al marcar como pendiente:', error);
        alert('Error al marcar como pendiente: ' + error.message);
      }
    },

    async notifyTech() {
      // Implementar notificación al técnico
      console.log('Notificando al técnico sobre:', this.selectedAlert);
    }
  }
};
</script>

<style scoped>
/* === Panel General === */
.alert-panel {
  border-radius: 1rem;
  padding: 1.5rem;
  margin: 1.5rem 0;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.05);
  font-family: "Segoe UI", sans-serif;
  transition: all 0.3s ease-in-out;
}

/* === Header === */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: bold;
  color: #ffffffdd;
}

.panel-header .title {
  display: flex;
  align-items: center;
  font-size: 1.3rem;
}

.badge.total {
  background-color: #2c2c2c;
  color: #00ffff;
  border: 1px solid #00ffff;
  padding: 0.4em 0.75em;
  border-radius: 0.5rem;
  font-weight: 600;
}

/* === Alertas === */
.alert-body {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Add space between alert boxes */
}

.alert-box {
  display: flex;
  flex-direction: column; /* Stack content vertically */
  padding: 1rem;
  border-radius: 0.75rem;
  font-weight: 500;
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.05);
  border-left: 5px solid #ccc;
  transition: transform 0.2s ease, box-shadow 0.3s;
}

.alert-box:hover {
  transform: translateX(0); /* Remove hover transform */
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.1); /* Subtle hover shadow */
}

.alert-box .alert-text {
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.alert-details {
    margin-bottom: 1rem;
    font-size: 0.9rem;
    color: #cccccc; /* Lighter text for details in dark mode */
}

.alert-details div {
    margin-bottom: 0.3rem;
}

.alert-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap; /* Allow buttons to wrap on smaller screens */
}

.alert-actions button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: bold;
    transition: background 0.2s ease;
}

.btn-report {
    background-color: #e74c3c; /* Red */
    color: white;
}

.btn-resolved {
    background-color: #2ecc71; /* Green */
    color: white;
}

.btn-pending {
    background-color: #f39c12; /* Orange */
    color: white;
}

.btn-tech {
    background-color: #3498db; /* Blue */
    color: white;
}

.alert-critical {
  border-left-color: #ff0033;
  color: #ffb3b3;
  background: rgba(255, 0, 51, 0.1);
}

.alert-warning {
  border-left-color: #ffc107;
  color: #fff3cd;
  background: rgba(255, 193, 7, 0.1);
}

.alert-text {
  color: inherit;
}

/* === No alertas === */
.empty-message {
  text-align: center;
  color: #aaa;
  padding: 1rem;
  font-style: italic;
}

/* === Animaciones === */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* === Tema oscuro === */
.dark-theme {
  background: linear-gradient(145deg, #0d0d0d, #1b1b1b);
  color: #e0e0e0;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.15);
}

/* === Tema claro opcional === */
.light-theme {
  background: #ffffff; /* White background for light mode */
  color: #333; /* Darker text color for light mode */
  border: 1px solid #e0e0e0; /* Subtle border for light mode */
  box-shadow: 0 2px 8px rgba(0,0,0,0.05); /* Subtle shadow for light mode */
}

.light-theme .panel-header {
  color: #1e4d92; /* Blue color for header in light mode */
}

.light-theme .badge.total {
  background-color: #e0e0e0; /* Light gray background for badge */
  color: #555; /* Darker text for badge */
  border-color: #ccc; /* Lighter border for badge */
}

.light-theme .alert-box {
  background: #f9f9f9; /* Very light gray background for alert items */
  border: 1px solid #eee; /* Subtle border for each box in light mode */
  border-left: 5px solid #ccc; /* Default border color */
  color: #333; /* Default text color */
  box-shadow: 0 1px 4px rgba(0,0,0,0.05); /* Subtle shadow for each box */
}

.light-theme .alert-box.alert-critical {
  border-left-color: #e74c3c; /* Red border for critical */
  color: #c0392b; /* Darker red text for critical */
  background: #fdeded; /* Very light red background */
}

.light-theme .alert-box.alert-warning {
  border-left-color: #f1c40f; /* Yellow border for warning */
  color: #b88b00; /* Darker yellow/brown text for warning */
  background: #fffceb; /* Very light yellow background */
}

.light-theme .alert-details {
    color: #555; /* Darker text for details in light mode */
}

.light-theme .alert-actions button {
    /* Default button styles for light mode */
    opacity: 0.9; /* Slightly transparent */
}

.light-theme .alert-actions button:hover {
     opacity: 1; /* Fully opaque on hover */
}

@media (max-width: 768px) {
  .panel-header .title {
    font-size: 1.1rem;
  }
  .alert-box {
    font-size: 0.9rem;
    padding: 0.6rem 0.9rem;
  }
   .alert-actions button {
        width: 100%; /* Full width buttons on small screens */
    }
}
</style>
