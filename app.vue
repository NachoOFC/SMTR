<script>
import GlobalLoader from '~/components/GlobalLoader.vue'
import NotificationToast from '~/components/NotificationToast.vue'

export default {
  components: {
    GlobalLoader,
    NotificationToast
  },
  middleware: ['auth'],
  data() {
    return {
      isLoading: true
    }
  },
  mounted() {
    // Ocultar el loader después de que la aplicación esté lista
    this.$nextTick(() => {
      setTimeout(() => {
        this.isLoading = false
      }, 500)
    })
  }
}
</script>

<template>
  <div>
    <GlobalLoader :isLoading="isLoading" />
    <NotificationToast />
    <NuxtPage />
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* Estilos globales responsivos */
@media (max-width: 768px) {
  .container {
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
