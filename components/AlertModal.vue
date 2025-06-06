<template>
  <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
          <button type="button" class="btn btn-primary" @click="confirmAction">{{ confirmButtonText }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    confirmButtonText: {
      type: String,
      default: 'Confirmar'
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    confirmAction() {
      this.$emit('confirm');
      this.closeModal();
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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1060;
}

.modal-dialog {
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 500px;
  overflow: hidden;
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
  max-height: 70vh;
  overflow-y: auto;
  color: #333;
}

.modal-footer {
  padding: 0.75rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

/* Dark mode styles */
.dark-mode .modal-dialog {
  background: #272741;
  color: #f0f0f0;
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

.dark-mode .btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
  color: #fff;
}

@media (max-width: 768px) {
  .modal-dialog {
    width: 95%;
  }
}
</style> 