<template>
  <div v-if="isLoading" class="global-loader">
    <div class="loader-content">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-3">Cargando...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GlobalLoader',
  props: {
    isLoading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.global-loader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.dark-mode .global-loader {
  background: rgba(39, 39, 65, 0.9);
}

.loader-content {
  text-align: center;
}

.loader-content p {
  margin: 0;
  color: #333;
}

.dark-mode .loader-content p {
  color: #fff;
}
</style> 