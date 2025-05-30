<template>
  <header :class="['topbar', darkMode ? 'dark-mode' : '']" :key="refreshKey">
    <div class="container-fluid">
      <div class="row align-items-center">
        <div class="col">
          <div class="search-section">
            <div class="input-group">
              <input type="text" placeholder="Buscar..." class="form-control search-input" />
              <button class="btn btn-outline-secondary search-btn">
                <i class="bi bi-search"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="col-auto d-flex align-items-center">
          <!-- Botón de modo oscuro -->
          <button 
            class="theme-toggle-btn btn"
            @click="toggleTheme"
            :title="darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
          >
            <i :class="darkMode ? 'bi bi-sun-fill' : 'bi bi-moon-fill'"></i>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { getAuth, signOut } from 'firebase/auth'

export default {
  components: {
    // REMOVED: AvatarSelector
  },
  
  props: {
    darkMode: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['toggle-theme'],
  
  data() {
    return {
      // Para forzar renderizado
      refreshKey: 0
    }
  },

  mounted() {
    // REMOVED: this.loadUserData();
    // REMOVED: document.addEventListener('click', this.closeMenu);
  },

  beforeDestroy() {
    document.removeEventListener('click', this.closeMenu);
  },
  
  computed: {
    
    
    
    // REMOVED: Avatar actual del usuario - siempre fresco desde localStorage
    // REMOVED: currentAvatarClass() {
    // REMOVED:   try {
    // REMOVED:     const avatarData = JSON.parse(localStorage.getItem('userAvatar'));
    // REMOVED:     if (avatarData && avatarData.value) {
    // REMOVED:       return `bi ${avatarData.value}`;
    // REMOVED:     }
    // REMOVED:   } catch (e) {
    // REMOVED:     console.error('Error obteniendo avatar:', e);
    // REMOVED:   }
    // REMOVED:   return 'bi bi-person-circle';
    // REMOVED: }
  },

  methods: {
    // Toggle para el modo oscuro
    toggleTheme() {
      this.$emit('toggle-theme');
    },
    
    // Cargar datos del usuario desde localStorage
    // REMOVED: loadUserData() {
    // REMOVED:   this.editedName = this.userName;
    // REMOVED:   this.editedEmail = this.userEmail;
    // REMOVED:   this.editedRole = this.userRole;
    // REMOVED:   this.editedDepartment = this.userDepartment;
    // REMOVED:   
    // REMOVED:   try {
    // REMOVED:     const savedAvatar = JSON.parse(localStorage.getItem('userAvatar'));
    // REMOVED:     if (savedAvatar) {
    // REMOVED:       this.selectedAvatar = JSON.parse(JSON.stringify(savedAvatar));
    // REMOVED:     }
    // REMOVED:   } catch (e) {
    // REMOVED:     console.error('Error al cargar avatar:', e);
    // REMOVED:   }
    // REMOVED: },
    
    // REMOVED: toggleProfileMenu() {
    // REMOVED:   this.showProfileMenu = !this.showProfileMenu;
    // REMOVED:   // Forzar actualización para refrescar el avatar
    // REMOVED:   if (this.showProfileMenu) {
    // REMOVED:     this.refreshKey++;
    // REMOVED:   }
    // REMOVED: },

    // REMOVED: showEditProfileModal() {
    // REMOVED:   this.showProfileMenu = false;
    // REMOVED:   this.showEditProfile = true;
    // REMOVED:   this.showAvatarSelector = false;
    // REMOVED:   this.loadUserData();
    // REMOVED: },
    
    // REMOVED: showSettingsModal() {
    // REMOVED:   // Placeholder para futura funcionalidad de configuración
    // REMOVED:   this.showProfileMenu = false;
    // REMOVED:   alert('Funcionalidad de configuración en desarrollo');
    // REMOVED: },
    
    // REMOVED: closeEditProfile() {
    // REMOVED:   this.showEditProfile = false;
    // REMOVED:   this.showAvatarSelector = false;
    // REMOVED: },
    
    // REMOVED: saveProfile() {
    // REMOVED:   
    // REMOVED:   // Forzar actualización completa del componente
    // REMOVED:   this.refreshKey++;
    // REMOVED:   
    // REMOVED:   // Mostrar feedback
    // REMOVED:   alert('¡Perfil actualizado correctamente!');
    // REMOVED:   
    // REMOVED:   // Cerrar modal y recargar la página para forzar la actualización
    // REMOVED:   this.showEditProfile = false;
    // REMOVED:   window.location.reload();
    // REMOVED: },
    
    // Cerrar sesión
    async logout() {
      const auth = getAuth(); // Asegúrate de que getAuth esté disponible
      signOut(auth)
        .then(() => {
          // Redirigir al login
          this.$router.push('/login');
        })
        .catch((error) => {
          console.error('Error al cerrar sesión:', error);
          // Puedes mostrar un mensaje de error al usuario si lo deseas
          alert('Error al cerrar sesión. Por favor, intenta de nuevo.');
        });
    },
    
    // Cerrar el menú al hacer clic fuera
    closeMenu(event) {
      if (this.showProfileMenu && !event.target.closest('.user-avatar')) {
        this.showProfileMenu = false;
      }
    }
  }
}
</script>

<style scoped>
.topbar {
  padding: 1rem;
  background: #fff;
  border-bottom: 1px solid #eee;
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 1020;
  color: #333;
}

/* Tema oscuro */
.dark-mode {
  background: #272741;
  color: #f0f0f0;
  border-bottom: 1px solid #333;
}

.dark-mode .search-input {
  background: #1a1a2e;
  border-color: #3a3a55;
  color: #f0f0f0;
}

.dark-mode .search-btn {
  background: #1a1a2e;
  border-color: #3a3a55;
  color: #f0f0f0;
}

.dark-mode .theme-toggle-btn {
  color: #f0f0f0;
}

.dark-mode .profile-menu {
  background: #272741;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
}

.dark-mode .profile-header {
  background: #1a1a2e;
  border-bottom: 1px solid #3a3a55;
}

.dark-mode .profile-name {
  color: #f0f0f0;
}

.dark-mode .menu-item:hover {
  background: #1a1a2e;
}

.dark-mode .modal-content {
  background: #272741;
  color: #f0f0f0;
}

.dark-mode .modal-header {
  border-bottom: 1px solid #3a3a55;
}

.dark-mode .modal-footer {
  border-top: 1px solid #3a3a55;
}

.dark-mode .form-control,
.dark-mode .form-select {
  background: #1a1a2e;
  border-color: #3a3a55;
  color: #f0f0f0;
}

.search-section {
  max-width: 400px;
}

.search-input {
  border-radius: 1.5rem 0 0 1.5rem;
  border-right: none;
}

.search-btn {
  border-radius: 0 1.5rem 1.5rem 0;
}

.theme-toggle-btn {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  padding: 0.5rem;
  cursor: pointer;
  color: #333;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle-btn:hover {
  transform: scale(1.1);
}

@media (max-width: 767.98px) {
  .topbar {
    padding: 0.7rem 0.5rem;
  }
  
  .search-section {
    max-width: 100%;
  }
  
  .modal-dialog {
    margin: 0.5rem;
  }
  
  .profile-pic {
    width: 80px;
    height: 80px;
  }
  
  .container-fluid {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}
</style> 