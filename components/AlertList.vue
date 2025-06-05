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
          <span class="alert-text"
            >{{ alert.levelText }} - {{ alert.text }}</span
          >
          <!-- Add placeholder for more alert details here -->
          <div class="alert-details">
              <div><strong>Ubicación:</strong> {{ alert.location }}</div>
              <div><strong>Valor Actual:</strong> {{ alert.currentValue }}</div>
              <div><strong>Umbral:</strong> {{ alert.threshold }}</div>
          </div>
           <div class="alert-actions">
                <button class="btn-report">Generar Reporte</button>
                <button class="btn-resolved">Marcar como Resuelta</button>
                <button class="btn-pending">Marcar Pendiente</button>
                <button class="btn-tech">Avisar a Tecnico</button>
            </div>
        </div>
      </transition-group>

      <div v-if="alerts.length === 0" class="empty-message">
        <i class="bi bi-check-circle me-2"></i> Sistema sin alertas
      </div>
    </div>
  </section>
</template>

<script>
import { useAssets } from '~/composables/useAssets';

export default {
  props: {
    darkMode: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      assets: [],
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
          // Add placeholder data for location, value, threshold
          location: asset.sector || 'N/A',
          currentValue: asset.value || 'N/A',
          threshold: 'N/A' // You might need to get this from your asset data
        }));
    },
  },

  mounted() {
    const { fetchAssets } = useAssets();
    fetchAssets((loadedAssets) => {
      this.assets = loadedAssets;
    });
  },
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
