<template>
  <div :class="['dashboard', darkMode ? 'dark-mode' : '']">
    <Sidebar />
    <div class="main-content">
      <Topbar :darkMode="darkMode" @toggle-theme="toggleTheme" />
      <div class="container-fluid px-md-4">
        <div class="construction-container">
          <h1>Ayuda</h1>
          <div class="construction-message">
            <i class="bi bi-tools"></i>
            <h2>En Construcción</h2>
            <p>Esta sección está siendo desarrollada. ¡Vuelve pronto!</p>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import Sidebar from '~/components/Sidebar.vue'
import Topbar from '~/components/Topbar.vue'
import { useNuxtApp } from '#app'

export default {
  components: {
    Sidebar,
    Topbar
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

.construction-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  text-align: center;
}

.construction-message {
  background: white;
  padding: 3rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-top: 2rem;
}

.construction-message i {
  font-size: 4rem;
  color: #1e4d92;
  margin-bottom: 1rem;
}

.construction-message h2 {
  color: #1e4d92;
  margin-bottom: 1rem;
}

/* Dark mode styles */
.dark-mode {
  background: #121212;
  color: #f0f0f0;
}

.dark-mode .construction-message {
  background: #272741;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.dark-mode .construction-message i,
.dark-mode .construction-message h2 {
  color: #4d92e0;
}

@media (max-width: 767.98px) {
  .main-content {
    margin-left: 0;
    margin-bottom: 60px;
  }
  
  .construction-message {
    margin: 1rem;
    padding: 2rem;
  }
}
</style> 