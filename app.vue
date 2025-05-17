<script>
export default {
  middleware: ['auth']
}
</script>

<template>
  <NuxtPage />
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
