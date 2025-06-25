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
    
    // Configuración de colores corporativos
    const primaryColor = [0, 123, 255]; // Azul principal
    const secondaryColor = [108, 117, 125]; // Gris
    const accentColor = [40, 167, 69]; // Verde
    const backgroundColor = [248, 249, 250]; // Gris claro
    
    // Función helper para agregar rectángulos con color
    const addColoredRect = (x, y, width, height, color, opacity = 1) => {
      doc.setFillColor(color[0], color[1], color[2]);
     
      doc.rect(x, y, width, height, 'F');
    };
    
    // Header con fondo azul
    addColoredRect(0, 0, 210, 40, primaryColor);
    
    // Agregar logo
    const logoImg = new Image();
    logoImg.src = '/image.png';
    
    const logoLoadPromise = new Promise((resolve, reject) => {
      logoImg.onload = () => resolve();
      logoImg.onerror = (err) => reject(err);
    });

    try {
      await logoLoadPromise;
      
      // Logo en el header
      const logoWidth = 25;
      const logoHeight = logoImg.naturalHeight * (logoWidth / logoImg.naturalWidth);
      doc.addImage(logoImg, 'PNG', 15, 8, logoWidth, logoHeight);

      // Título principal en blanco
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('REPORTE DE ACTIVO', 50, 20);
      
      // Subtítulo
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text('Detalles Técnicos y Operacionales', 50, 30);
      
      // Fecha y hora de generación
      const now = new Date();
      const dateStr = now.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      const timeStr = now.toLocaleTimeString('es-ES');
      doc.setFontSize(10);
      doc.text(`Generado el ${dateStr} a las ${timeStr}`, 15, 52);

      // Resetear color de texto
      doc.setTextColor(0, 0, 0);
      
      let yOffset = 70;

      if (this.assetDetails) {
        // Sección de información básica con fondo
        addColoredRect(10, yOffset - 5, 190, 50, backgroundColor, 0.3);
        
        // Título de sección
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(' INFORMACIÓN BÁSICA', 15, yOffset + 5);
        
        // Línea divisoria
        doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setLineWidth(0.5);
        doc.line(15, yOffset + 8, 195, yOffset + 8);
        
        yOffset += 18;
        
        // Información en dos columnas
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        
        // Columna izquierda
        doc.text('ID del Activo:', 15, yOffset);
        doc.setFont('helvetica', 'normal');
        doc.text(this.assetId, 50, yOffset);
        
        doc.setFont('helvetica', 'bold');
        doc.text('Empresa:', 15, yOffset + 8);
        doc.setFont('helvetica', 'normal');
        doc.text(this.assetDetails.company || 'N/A', 50, yOffset + 8);
        
        // Columna derecha
        doc.setFont('helvetica', 'bold');
        doc.text('Tipo de Activo:', 110, yOffset);
        doc.setFont('helvetica', 'normal');
        doc.text(this.assetDetails.asset_type || 'Sin Nombre', 150, yOffset);
        
        doc.setFont('helvetica', 'bold');
        doc.text('Sector:', 110, yOffset + 8);
        doc.setFont('helvetica', 'normal');
        doc.text(this.assetDetails.sector_location || 'N/A', 150, yOffset + 8);
        
        yOffset += 25;
        
        // Última actualización destacada
        addColoredRect(10, yOffset - 3, 190, 15, accentColor, 0.1);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
        doc.text('🕒 Última Actualización:', 15, yOffset + 5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(this.formatTimestamp(this.assetDetails.timestamp) || 'N/A', 70, yOffset + 5);
        
        yOffset += 25;

        // Sección de valores registrados
        if (this.assetDetails.values && Object.keys(this.assetDetails.values).length > 0) {
          // Título de sección
          doc.setFontSize(16);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          doc.text('VALORES REGISTRADOS', 15, yOffset);
          
          // Línea divisoria
          doc.line(15, yOffset + 3, 195, yOffset + 3);
          
          yOffset += 15;
          
          // Crear tabla con los valores
          const values = this.assetDetails.values;
          const entries = Object.entries(values);
          
          // Headers de la tabla
          addColoredRect(15, yOffset - 5, 180, 12, primaryColor, 0.8);
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text('PARAMETRO', 20, yOffset + 2);
          doc.text('VALOR', 120, yOffset + 2);
          
          yOffset += 12;
          
          // Filas de la tabla
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(10);
          
          entries.forEach((entry, index) => {
            const [key, value] = entry;
            const isEven = index % 2 === 0;
            
            // Fondo alternado para las filas
            if (isEven) {
              addColoredRect(15, yOffset - 3, 180, 10, backgroundColor, 0.5);
            }
            
            // Texto de la fila
            doc.setFont('helvetica', 'bold');
            doc.text(key, 20, yOffset + 3);
            doc.setFont('helvetica', 'normal');
            doc.text(String(value), 120, yOffset + 3);
            
            yOffset += 10;
            
            // Verificar si necesitamos una nueva página
            if (yOffset > 250) {
              doc.addPage();
              yOffset = 20;
            }
          });
          
          // Borde de la tabla
          doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          doc.setLineWidth(0.5);
          doc.rect(15, yOffset - (entries.length * 10) - 12, 180, (entries.length * 10) + 12);
          
        } else {
          // No hay valores
          doc.setFontSize(16);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
          doc.text('📊 VALORES REGISTRADOS', 15, yOffset);
          doc.line(15, yOffset + 3, 195, yOffset + 3);
          
          yOffset += 20;
          addColoredRect(15, yOffset - 5, 180, 20, [255, 193, 7], 0.2);
          doc.setFontSize(12);
          doc.setFont('helvetica', 'italic');
          doc.text('⚠️ No hay valores registrados para este activo', 20, yOffset + 5);
        }
        
        // Footer
        const pageHeight = doc.internal.pageSize.height;
        addColoredRect(0, pageHeight - 20, 210, 20, backgroundColor, 0.8);
        
        doc.setFontSize(8);
        doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.setFont('helvetica', 'normal');
        doc.text('Este reporte ha sido generado automáticamente por el sistema de gestión de activos', 15, pageHeight - 10);
        doc.text(`Página 1 de 1`, 170, pageHeight - 10);
        
        // Marca de agua sutil
        
        doc.setFontSize(60);
        doc.setTextColor(128, 128, 128);
        
      }

      // Guardar el PDF con nombre mejorado
      const fileName = `Reporte_Activo_${this.assetId}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

    } catch (error) {
      console.error('Error loading logo or generating PDF:', error);
      
      // Mostrar mensaje de error más elegante
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          icon: 'error',
          title: 'Error al generar PDF',
          text: 'Hubo un problema al generar el reporte. Por favor, inténtalo de nuevo.',
          confirmButtonColor: '#007bff'
        });
      } else {
        alert('Error al generar el PDF. Por favor, inténtalo de nuevo.');
      }
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