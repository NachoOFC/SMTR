<template>
  <div v-if="asset" class="modal-overlay" @click.self="closeModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Detalles del Activo: {{ asset.name }}</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body" id="asset-details-content">
          <p><strong>Sector:</strong> {{ asset.sector }}</p>
          <p><strong>Estado:</strong> {{ asset.status }}</p>
          <!-- Aquí listaremos todos los valores del objeto values -->
          <h6>Valores Recientes:</h6>
          <ul>
            <li v-for="(value, key) in asset.latestValues" :key="key">
              <strong>{{ key }}:</strong> {{ value }}
            </li>
          </ul>
          <!-- Otros detalles que quieras mostrar -->
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Cerrar</button>
          <button type="button" class="btn btn-primary" @click="generateAndDownloadPDF">Descargar PDF</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Importar la librería html2pdf.js

export default {
  props: {
    asset: { // Espera un objeto asset completo, incluyendo los valores
      type: Object,
      default: null
    },
    darkMode: { // Propiedad para saber si está en modo oscuro
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },

    async generateAndDownloadPDF() {
      // Obtener el elemento del modal-body que contiene los detalles
      const element = document.getElementById('asset-details-content');
      
      if (!element) {
        console.error('No se encontró el elemento del contenido del modal para generar el PDF.');
        return;
      }

      // Opciones para la generación del PDF
      const options = {
        margin: 10,
        filename: `detalles-activo-${this.asset.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Importar la librería html2pdf.js
      const html2pdf = await import('html2pdf.js');

      // Usar html2pdf para generar y descargar el PDF
      html2pdf().from(element).set(options).save();
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); /* Fondo semitransparente oscuro */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1060; /* Z-index alto para estar por encima de otros elementos */
}

.modal-dialog {
  background: #fff; /* Fondo blanco para el modal en modo claro */
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 500px; /* Ancho máximo del modal */
  overflow: hidden; /* Para asegurar que el contenido no se salga */
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  margin-bottom: 0;
  font-size: 1.25rem;
  color: #333;
}

.modal-body {
  padding: 1rem;
  max-height: 70vh; /* Altura máxima del cuerpo para scroll si es necesario */
  overflow-y: auto;
  color: #333;
}

.modal-footer {
  padding: 0.75rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
}

/* Estilos básicos para el modo oscuro del modal */
.dark-mode .modal-dialog {
  background: #272741; /* Fondo oscuro para el modal */
  color: #f0f0f0; /* Texto claro */
}

.dark-mode .modal-header {
  border-bottom: 1px solid #3a3a55;
}

.dark-mode .modal-title {
  color: #f0f0f0;
}

.dark-mode .modal-body {
   color: #e0e0e0;
}

.dark-mode .modal-footer {
  border-top: 1px solid #3a3a55;
}

/* Estilos específicos para el modo oscuro si fueran necesarios */
/* Revertir estilos del botón secundario en modo oscuro */
.dark-mode .btn-secondary {
    background-color: #6c757d; /* Color original de Bootstrap secondary */
    border-color: #6c757d; /* Color original de Bootstrap secondary */
    color: #fff; /* Texto blanco por defecto en botones oscuros */
}

@media (max-width: 768px) {
  .modal-dialog {
    width: 95%;
  }
}

</style> 