<template>
  <div :class="['dashboard', darkMode ? 'dark-mode' : '']">
    <Sidebar />
    <div class="main-content">
      <Topbar :darkMode="darkMode" @toggle-theme="toggleTheme" />
      <div class="container-fluid px-md-4">
        <h1 class="mb-4">Centro de Alertas</h1>
        
        <AlertList :darkMode="darkMode" />
        
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '~/components/Sidebar.vue'
import Topbar from '~/components/Topbar.vue'
import AlertList from '~/components/AlertList.vue'
import { useNuxtApp } from '#app'

export default {
  name: 'Alertas',
  components: {
    Sidebar,
    Topbar,
    AlertList
  },

  data() {
    return {
      darkMode: false
    }
  },

  mounted() {
    if (process.client) {
      const { $isAuthenticated } = useNuxtApp();
      if (!$isAuthenticated.value) {
        navigateTo('/login', { replace: true });
      }
      
      // Cargar preferencia de tema oscuro y aplicar a body
      this.darkMode = localStorage.getItem('darkMode') === 'true';
      if (this.darkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }
  },
  
  methods: {
    toggleTheme() {
      this.darkMode = !this.darkMode;
    }
  }
}
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  background: #f7f7fb;
}

.main-content {
  flex: 1;
  margin-left: 220px;
  transition: all 0.3s ease;
}

h1 {
  color: inherit;
  margin-top: 1.5rem;
}

/* Dark mode styles */
.dark-mode {
  background: #121212;
  color: #f0f0f0;
}

@media (max-width: 767.98px) {
  .main-content {
    margin-left: 0;
    margin-bottom: 60px;
  }
}
</style> 