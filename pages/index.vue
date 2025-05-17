<template>
  <div class="redirect-container">
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-3">Redirigiendo a login...</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  beforeMount() {
    // Redirigir inmediatamente al login
    window.location.href = '/login';
  }
}
</script>
