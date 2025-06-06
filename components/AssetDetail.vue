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
    
    // Configurar colores (RGB)
    const primaryColor = [0, 123, 255]; // #007bff
    const secondaryColor = [108, 117, 125]; // #6c757d
    const accentColor = [40, 167, 69]; // #28a745
    const lightGray = [248, 249, 250];
    const darkGray = [33, 37, 41];
    
    try {
      // === ENCABEZADO MEJORADO ===
      // Fondo del encabezado
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 50, 'F');
      
      // Logo
      const logoImg = new Image();
      logoImg.src = '/image.png';
      
      const logoLoadPromise = new Promise((resolve, reject) => {
        logoImg.onload = () => resolve();
        logoImg.onerror = (err) => reject(err);
      });
      
      await logoLoadPromise;
      
      const logoWidth = 30;
      const logoHeight = logoImg.naturalHeight * (logoWidth / logoImg.naturalWidth);
      doc.addImage(logoImg, 'PNG', 15, 12, logoWidth, logoHeight);
      
      // Título principal
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('REPORTE DE ACTIVO', 55, 22);
      
      // Subtítulo
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Detalles y Valores Registrados del Sistema', 55, 30);
      
      // Fecha de generación
      const currentDate = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      doc.setFontSize(10);
      doc.text(`Generado: ${currentDate}`, 55, 38);
      
      // Línea decorativa
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(2);
      doc.line(15, 45, 195, 45);
      
      // === INFORMACIÓN BÁSICA ===
      let yOffset = 65;
      
      // Título de sección
      doc.setFillColor(...primaryColor);
      doc.rect(15, yOffset - 8, 180, 15, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('INFORMACION DEL ACTIVO', 20, yOffset);
      
      yOffset += 15;
      
      // Fondo de la sección
      doc.setFillColor(...lightGray);
      doc.rect(15, yOffset, 180, 55, 'F');
      doc.setDrawColor(...primaryColor);
      doc.setLineWidth(1);
      doc.rect(15, yOffset, 180, 55, 'S');
      
      if (this.assetDetails) {
        doc.setTextColor(...darkGray);
        doc.setFontSize(11);
        
        // Información en formato tabla
        const leftColumn = 25;
        const rightColumn = 110;
        const labelWidth = 35;
        
        // Fila 1
        doc.setFont('helvetica', 'bold');
        doc.text('ID:', leftColumn, yOffset + 12);
        doc.setFont('helvetica', 'normal');
        doc.text(this.assetId, leftColumn + labelWidth, yOffset + 12);
        
        doc.setFont('helvetica', 'bold');
        doc.text('Tipo:', rightColumn, yOffset + 12);
        doc.setFont('helvetica', 'normal');
        const assetType = this.assetDetails.asset_type || 'Sin Nombre';
        // Truncar texto si es muy largo
        const truncatedType = assetType.length > 25 ? assetType.substring(0, 25) + '...' : assetType;
        doc.text(truncatedType, rightColumn + labelWidth, yOffset + 12);
        
        // Fila 2
        doc.setFont('helvetica', 'bold');
        doc.text('Empresa:', leftColumn, yOffset + 24);
        doc.setFont('helvetica', 'normal');
        const company = this.assetDetails.company || 'N/A';
        const truncatedCompany = company.length > 20 ? company.substring(0, 20) + '...' : company;
        doc.text(truncatedCompany, leftColumn + labelWidth, yOffset + 24);
        
        doc.setFont('helvetica', 'bold');
        doc.text('Sector:', rightColumn, yOffset + 24);
        doc.setFont('helvetica', 'normal');
        const sector = this.assetDetails.sector_location || 'N/A';
        const truncatedSector = sector.length > 25 ? sector.substring(0, 25) + '...' : sector;
        doc.text(truncatedSector, rightColumn + labelWidth, yOffset + 24);
        
        // Fila 3 - Fecha (centrada)
        doc.setFont('helvetica', 'bold');
        doc.text('Ultima Actualizacion:', leftColumn, yOffset + 36);
        doc.setFont('helvetica', 'normal');
        const timestamp = this.formatTimestamp(this.assetDetails.timestamp) || 'N/A';
        doc.text(timestamp, leftColumn + 60, yOffset + 36);
        
        // Líneas separadoras
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(leftColumn, yOffset + 18, rightColumn + 70, yOffset + 18);
        doc.line(leftColumn, yOffset + 30, rightColumn + 70, yOffset + 30);
        doc.line(rightColumn - 5, yOffset + 6, rightColumn - 5, yOffset + 30);
      }
      
      yOffset += 70;
      
      // === VALORES REGISTRADOS ===
      if (this.assetDetails && this.assetDetails.values) {
        // Título de la sección
        doc.setFillColor(...accentColor);
        doc.rect(15, yOffset - 8, 180, 15, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('VALORES REGISTRADOS', 20, yOffset);
        
        yOffset += 15;
        
        // Función para obtener símbolo según el tipo de valor
        const getValueSymbol = (key) => {
          const keyLower = key.toLowerCase();
          
          if (keyLower.includes('temp') || keyLower.includes('temperatura')) return 'TEMP';
          if (keyLower.includes('hum') || keyLower.includes('humedad')) return 'HUM';
          if (keyLower.includes('pres') || keyLower.includes('presion')) return 'PRES';
          if (keyLower.includes('volt') || keyLower.includes('tension')) return 'VOLT';
          if (keyLower.includes('corr') || keyLower.includes('current')) return 'AMP';
          if (keyLower.includes('vel') || keyLower.includes('speed')) return 'VEL';
          if (keyLower.includes('dist') || keyLower.includes('distance')) return 'DIST';
          if (keyLower.includes('peso') || keyLower.includes('weight')) return 'PESO';
          if (keyLower.includes('luz') || keyLower.includes('light')) return 'LUZ';
          if (keyLower.includes('sonido') || keyLower.includes('sound')) return 'AUDIO';
          if (keyLower.includes('co2') || keyLower.includes('carbon')) return 'CO2';
          if (keyLower.includes('ph')) return 'PH';
          if (keyLower.includes('flow') || keyLower.includes('flujo')) return 'FLOW';
          if (keyLower.includes('level') || keyLower.includes('nivel')) return 'LEVEL';
          if (keyLower.includes('power') || keyLower.includes('potencia')) return 'PWR';
          if (keyLower.includes('freq') || keyLower.includes('frecuencia')) return 'FREQ';
          if (keyLower.includes('rpm')) return 'RPM';
          if (keyLower.includes('status') || keyLower.includes('estado')) return 'STAT';
          if (keyLower.includes('alarm') || keyLower.includes('alarma')) return 'ALRM';
          if (keyLower.includes('error')) return 'ERR';
          if (keyLower.includes('ok') || keyLower.includes('normal')) return 'OK';
          
          return 'DATA';
        };
        
        // Obtener color para el tipo de valor
        const getValueColor = (key) => {
          const keyLower = key.toLowerCase();
          
          if (keyLower.includes('temp')) return [255, 87, 34]; // Naranja
          if (keyLower.includes('hum')) return [33, 150, 243]; // Azul
          if (keyLower.includes('pres')) return [156, 39, 176]; // Púrpura
          if (keyLower.includes('volt') || keyLower.includes('corr')) return [255, 193, 7]; // Amarillo
          if (keyLower.includes('error') || keyLower.includes('alarm')) return [244, 67, 54]; // Rojo
          if (keyLower.includes('ok') || keyLower.includes('normal')) return [76, 175, 80]; // Verde
          
          return primaryColor; // Color por defecto
        };
        
        // Organizar valores en grid
        const values = Object.entries(this.assetDetails.values);
        const itemsPerRow = 2;
        const columnWidth = 85;
        const rowHeight = 35;
        
        values.forEach((value, index) => {
          const [key, val] = value;
          const row = Math.floor(index / itemsPerRow);
          const col = index % itemsPerRow;
          
          const x = 20 + (col * columnWidth);
          const y = yOffset + (row * rowHeight);
          
          // Verificar si necesitamos nueva página
          if (y > 250) {
            doc.addPage();
            yOffset = 20;
            const newY = yOffset + (row * rowHeight);
            
            // Fondo del elemento
            doc.setFillColor(255, 255, 255);
            doc.rect(x - 5, newY - 5, columnWidth - 10, rowHeight - 5, 'F');
            
            // Borde del elemento
            doc.setDrawColor(...getValueColor(key));
            doc.setLineWidth(1.5);
            doc.rect(x - 5, newY - 5, columnWidth - 10, rowHeight - 5, 'S');
            
            // Símbolo del tipo
            doc.setFillColor(...getValueColor(key));
            doc.rect(x - 3, newY - 3, 25, 12, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.text(getValueSymbol(key), x, newY + 5);
            
            // Nombre del parámetro
            doc.setTextColor(...darkGray);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            const truncatedKey = key.length > 12 ? key.substring(0, 12) + '...' : key;
            doc.text(truncatedKey, x, newY + 15);
            
            // Valor
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...getValueColor(key));
            const truncatedVal = String(val).length > 10 ? String(val).substring(0, 10) + '...' : String(val);
            doc.text(truncatedVal, x, newY + 25);
            
            return;
          }
          
          // Fondo del elemento
          doc.setFillColor(255, 255, 255);
          doc.rect(x - 5, y - 5, columnWidth - 10, rowHeight - 5, 'F');
          
          // Borde del elemento
          doc.setDrawColor(...getValueColor(key));
          doc.setLineWidth(1.5);
          doc.rect(x - 5, y - 5, columnWidth - 10, rowHeight - 5, 'S');
          
          // Símbolo del tipo
          doc.setFillColor(...getValueColor(key));
          doc.rect(x - 3, y - 3, 25, 12, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(8);
          doc.setFont('helvetica', 'bold');
          doc.text(getValueSymbol(key), x, y + 5);
          
          // Nombre del parámetro
          doc.setTextColor(...darkGray);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          const truncatedKey = key.length > 12 ? key.substring(0, 12) + '...' : key;
          doc.text(truncatedKey, x, y + 15);
          
          // Valor
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...getValueColor(key));
          const truncatedVal = String(val).length > 10 ? String(val).substring(0, 10) + '...' : String(val);
          doc.text(truncatedVal, x, y + 25);
        });
        
        // Ajustar yOffset para el siguiente contenido
        const totalRows = Math.ceil(values.length / itemsPerRow);
        yOffset += (totalRows * rowHeight) + 15;
        
      } else {
        // No hay valores
        doc.setFillColor(255, 248, 220);
        doc.rect(15, yOffset, 180, 25, 'F');
        doc.setDrawColor(255, 193, 7);
        doc.setLineWidth(1);
        doc.rect(15, yOffset, 180, 25, 'S');
        
        doc.setFontSize(12);
        doc.setTextColor(138, 109, 59);
        doc.setFont('helvetica', 'bold');
        doc.text('AVISO: No hay valores registrados', 20, yOffset + 10);
        doc.setFont('helvetica', 'normal');
        doc.text('Los datos apareceran aqui cuando esten disponibles.', 20, yOffset + 18);
        
        yOffset += 35;
      }
      
      // === PIE DE PÁGINA ===
      // Verificar si hay espacio, si no, agregar nueva página
      if (yOffset > 250) {
        doc.addPage();
        yOffset = 20;
      }
      
      // Línea decorativa
      doc.setDrawColor(...primaryColor);
      doc.setLineWidth(1);
      doc.line(15, yOffset + 10, 195, yOffset + 10);
      
      // Información del pie
      doc.setFontSize(8);
      doc.setTextColor(...secondaryColor);
      doc.setFont('helvetica', 'normal');
      doc.text('Sistema de Monitoreo de Activos - Generado automaticamente', 20, yOffset + 20);
      doc.text(`ID del Reporte: ${this.assetId}-${Date.now()}`, 20, yOffset + 27);
      doc.text('Documento confidencial - Uso interno unicamente', 20, yOffset + 34);
      
      // Guardar el PDF
      const fileName = `reporte-activo-${this.assetId}-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF. Por favor, intente nuevamente.');
    }
    
  } else {
    console.warn('La generacion de PDF solo esta disponible en el lado del cliente.');
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