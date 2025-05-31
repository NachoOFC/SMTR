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
  gap: 1rem;
}

.alert-box {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-weight: 500;
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.05);
  border-left: 5px solid #ccc;
  transition: transform 0.2s ease, box-shadow 0.3s;
}

.alert-box:hover {
  transform: translateX(6px);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.05);
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
  background: #fdfdfd;
  color: #222;
  border: 1px solid #ccc;
}

@media (max-width: 768px) {
  .panel-header .title {
    font-size: 1.1rem;
  }
  .alert-box {
    font-size: 0.9rem;
    padding: 0.6rem 0.9rem;
  }
}
</style>
