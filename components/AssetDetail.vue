<template>
  <div :class="['asset-detail', darkMode ? 'dark-mode' : '']">
    <div class="card shadow-sm">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h4 class="mb-0">Detalles del Activo</h4>
        <button class="btn btn-secondary btn-sm" @click="$emit('back')">Volver</button>
      </div>
      <div class="card-body" v-if="assetDetails">
        <h5>{{ assetDetails.asset_type || 'Sin Nombre' }}</h5>
        <p><strong>ID:</strong> {{ assetId }}</p>
        <p><strong>Empresa:</strong> {{ assetDetails.company || 'N/A' }}</p>
        <p><strong>Sector:</strong> {{ assetDetails.sector_location || 'N/A' }}</p>
        <p><strong>Última Actualización:</strong> {{ formatTimestamp(assetDetails.timestamp) || 'N/A' }}</p>

        <hr>

        <h6>Valores Registrados:</h6>
        <ul v-if="assetDetails.values">
          <li v-for="(value, key) in assetDetails.values" :key="key">
            <strong>{{ key }}:</strong> {{ value }}
          </li>
        </ul>
        <p v-else>No hay valores registrados.</p>

        <button class="btn btn-primary mt-4" @click="downloadPdf">Descargar PDF</button>

      </div>
      <div class="card-body" v-else>
        <p>Cargando detalles del activo o no se encontraron datos.</p>
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
}

.asset-detail .card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}

.asset-detail .dark-mode .card {
  background-color: #272741;
  color: #f0f0f0;
  border-color: #3a3a55;
}

.asset-detail .dark-mode .card-header {
   background-color: #1e1e2d;
   border-bottom-color: #3a3a55;
   color: #f0f0f0;
}

.asset-detail .dark-mode h4, .asset-detail .dark-mode h5, .asset-detail .dark-mode h6 {
  color: #f0f0f0;
}

.asset-detail .dark-mode p {
  color: #e0e0e0;
}

.asset-detail .dark-mode strong {
  color: #ffffff;
}

.asset-detail .dark-mode hr {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.asset-detail .dark-mode ul li {
  color: #e0e0e0;
}
</style> 