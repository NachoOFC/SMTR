<template>
  <div :class="['asset-detail', darkMode ? 'dark-mode' : '']">
    <div class="card shadow-sm">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h4 class="mb-0">Detalles del Activo</h4>
        <div class="header-actions">
          <!-- PDF Download Icon Button -->
          <button 
            class="btn btn-icon me-2" 
            @click="downloadPdf"
            :title="'Descargar PDF'"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </button>
          <!-- Back Button -->
          <button class="btn btn-secondary btn-sm" @click="$emit('back')">Volver</button>
        </div>
      </div>
      <div class="card-body" v-if="assetDetails">
        <div class="asset-info">
          <h5 class="asset-title">{{ assetDetails.asset_type || 'Sin Nombre' }}</h5>
          
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">ID:</span>
              <span class="info-value">{{ assetId }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Empresa:</span>
              <span class="info-value">{{ assetDetails.company || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Sector:</span>
              <span class="info-value">{{ assetDetails.sector_location || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Última Actualización:</span>
              <span class="info-value">{{ formatTimestamp(assetDetails.timestamp) || 'N/A' }}</span>
            </div>
          </div>
        </div>

        <hr class="section-divider">

        <div class="values-section">
          <h6 class="section-title">Valores Registrados</h6>
          <div v-if="assetDetails.values" class="values-grid">
            <div v-for="(value, key) in assetDetails.values" :key="key" class="value-item">
              <span class="value-label">{{ key }}</span>
              <span class="value-data">{{ value }}</span>
            </div>
          </div>
          <div v-else class="no-values">
            <p>No hay valores registrados.</p>
          </div>
        </div>

      </div>
      <div class="card-body" v-else>
        <div class="loading-state">
          <div class="spinner-border spinner-border-sm me-2" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mb-0">Cargando detalles del activo o no se encontraron datos.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDatabase, ref, onValue } from "firebase/database";
// Import jspdf and html2canvas dynamically on the client side
let jsPDF;
let html2canvas;

if (process.client) {
  import('jspdf').then(module => {
    jsPDF = module.default;
  });
  import('html2canvas').then(module => {
    html2canvas = module.default;
  });
}

export default {
  props: {
    assetId: { 
      type: String, 
      required: true 
    },
    darkMode: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      assetDetails: null
    }
  },

  mounted() {
    this.fetchAssetDetails();
    this.initTooltips();
  },

  methods: {
    fetchAssetDetails() {
      const db = getDatabase();
      // Reference the specific component using the assetId prop
      const assetRef = ref(db, `components/${this.assetId}/data`);

      onValue(assetRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Find the latest timestamped entry
          const timestamps = Object.keys(data).sort();
          const latestTimestamp = timestamps[timestamps.length - 1];
          this.assetDetails = data[latestTimestamp];
           console.log('Detalles del activo cargados:', this.assetDetails);
        } else {
          this.assetDetails = null;
          console.log(`No se encontraron datos para el activo con ID: ${this.assetId}`);
        }
      }, (error) => {
        console.error('Error al cargar detalles del activo de Firebase:', error);
        this.assetDetails = null;
      });
    },

    initTooltips() {
      // Initialize Bootstrap tooltips if available
      if (typeof window !== 'undefined' && window.bootstrap) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
          return new window.bootstrap.Tooltip(tooltipTriggerEl);
        });
      }
    },

    formatTimestamp(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp * 1000); // Firebase timestamp is in seconds
      return date.toLocaleString();
    },

    async downloadPdf() {
      if (process.client && jsPDF) { 
        const doc = new jsPDF();
        
        // Add logo at the top
        const logoImg = new Image();
        
        logoImg.src = '/SMTR.png'; 

        // Use a promise to wait for the image to load
        const logoLoadPromise = new Promise((resolve, reject) => {
          logoImg.onload = () => resolve();
          logoImg.onerror = (err) => reject(err);
        });

        try {
          await logoLoadPromise;
          
          
          const logoWidth = 40;
          const logoHeight = logoImg.naturalHeight * (logoWidth / logoImg.naturalWidth);
          const logoX = 10; // X position
          const logoY = 10; // Y position

          doc.addImage(logoImg, 'PNG', logoX, logoY, logoWidth, logoHeight);

          // Add title below the logo
          doc.setFontSize(18);
          doc.text('Reporte de Detalles del Activo', 50, 30);

          // Add asset details directly using doc.text
          doc.setFontSize(12);
          let yOffset = 50; // Start below the title

          if (this.assetDetails) {
            doc.text(`ID: ${this.assetId}`, 10, yOffset);
            yOffset += 10;
            doc.text(`Nombre: ${this.assetDetails.asset_type || 'Sin Nombre'}`, 10, yOffset);
            yOffset += 10;
            doc.text(`Empresa: ${this.assetDetails.company || 'N/A'}`, 10, yOffset);
            yOffset += 10;
            doc.text(`Sector: ${this.assetDetails.sector_location || 'N/A'}`, 10, yOffset);
            yOffset += 10;
            doc.text(`Última Actualización: ${this.formatTimestamp(this.assetDetails.timestamp) || 'N/A'}`, 10, yOffset);
            yOffset += 20;

            doc.text('Valores Registrados:', 10, yOffset);
            yOffset += 10;

            if (this.assetDetails.values) {
              for (const key in this.assetDetails.values) {
                doc.text(`- ${key}: ${this.assetDetails.values[key]}`, 15, yOffset);
                yOffset += 10;
              }
            }
          }

          doc.save(`reporte-activo-${this.assetId}.pdf`);

        } catch (error) {
          console.error('Error loading logo or generating PDF:', error);
          alert('Error generating PDF. Please try again.');
        }

      } else {
        console.warn('PDF generation is only available on the client side.');
      }
    }
  }
}
</script>

<style scoped>
.asset-detail .card {
  border-radius: 0.75rem;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.asset-detail .card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.75rem 0.75rem 0 0;
}

.header-actions {
  display: flex;
  align-items: center;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 2px solid #007bff;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn-icon:hover {
  background-color: #0056b3;
  border-color: #0056b3;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

.btn-icon:active {
  transform: translateY(0);
}

.asset-info {
  margin-bottom: 1.5rem;
}

.asset-title {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-weight: 600;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0.75rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  border-left: 4px solid #007bff;
}

.info-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.info-value {
  font-size: 1rem;
  color: #495057;
  font-weight: 500;
}

.section-divider {
  margin: 2rem 0;
  border-top: 2px solid #e9ecef;
}

.values-section {
  margin-top: 1.5rem;
}

.section-title {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-weight: 600;
  font-size: 1.1rem;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.value-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.value-item:hover {
  border-color: #007bff;
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.1);
}

.value-label {
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
}

.value-data {
  color: #007bff;
  font-weight: 500;
  font-size: 0.95rem;
}

.no-values {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
  font-style: italic;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #6c757d;
}

/* Dark Mode Styles */
.asset-detail.dark-mode .card {
  background-color: #272741;
  color: #f0f0f0;
  border-color: #3a3a55;
}

.asset-detail.dark-mode .card-header {
   background-color: #1e1e2d;
   border-bottom-color: #3a3a55;
   color: #f0f0f0;
}

.asset-detail.dark-mode .btn-icon {
  border-color: #0d6efd;
  background-color: #0d6efd;
}

.asset-detail.dark-mode .btn-icon:hover {
  background-color: #0b5ed7;
  border-color: #0b5ed7;
  box-shadow: 0 4px 8px rgba(13, 110, 253, 0.3);
}

.asset-detail.dark-mode .asset-title,
.asset-detail.dark-mode .section-title {
  color: #f0f0f0;
}

.asset-detail.dark-mode .info-item {
  background-color: #1e1e2d;
  border-left-color: #0d6efd;
}

.asset-detail.dark-mode .info-label {
  color: #a0a0b0;
}

.asset-detail.dark-mode .info-value {
  color: #e0e0e0;
}

.asset-detail.dark-mode .section-divider {
  border-top-color: rgba(255, 255, 255, 0.1);
}

.asset-detail.dark-mode .value-item {
  background-color: #1e1e2d;
  border-color: #3a3a55;
}

.asset-detail.dark-mode .value-item:hover {
  border-color: #0d6efd;
  box-shadow: 0 2px 4px rgba(13, 110, 253, 0.2);
}

.asset-detail.dark-mode .value-label {
  color: #e0e0e0;
}

.asset-detail.dark-mode .value-data {
  color: #0d6efd;
}

.asset-detail.dark-mode .no-values,
.asset-detail.dark-mode .loading-state {
  color: #a0a0b0;
}
</style>