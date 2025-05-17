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
          
          <div class="user-avatar ms-2" @click="toggleProfileMenu">
            <span class="avatar-icon">
              <i :class="currentAvatarClass"></i>
            </span>
            <div v-if="showProfileMenu" class="profile-menu">
              <div class="profile-header">
                <span class="profile-name">{{ userName }}</span>
                <span class="profile-email">{{ userEmail || 'Sin email' }}</span>
              </div>
              <div class="menu-item" @click="showEditProfileModal"><i class="bi bi-pencil-fill me-2"></i> Mi perfil</div>
              <div class="menu-item" @click="showSettingsModal"><i class="bi bi-gear-fill me-2"></i> Configuración</div>
              <div class="menu-item" @click="logout"><i class="bi bi-box-arrow-right me-2"></i> Cerrar sesión</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Edición de Perfil -->
    <div v-if="showEditProfile" :class="['modal-overlay', darkMode ? 'dark-mode' : '']" @click="closeEditProfile">
      <div class="modal-dialog" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Editar Perfil</h5>
            <button type="button" class="btn-close" @click="closeEditProfile"></button>
          </div>
          <div class="modal-body">
            <div class="text-center mb-4">
              <div class="profile-pic">
                <i :class="currentAvatarClass + ' display-4'"></i>
              </div>
              <button class="btn btn-sm btn-outline-primary mt-2" @click="showAvatarSelector = true">Cambiar avatar</button>
            </div>
            
            <!-- Selector de Avatares -->
            <div v-if="showAvatarSelector" class="avatar-selector-container mb-4">
              <div class="avatar-selector-header d-flex justify-content-between mb-2">
                <h6>Selecciona tu avatar</h6>
                <button type="button" class="btn-close" @click="showAvatarSelector = false"></button>
              </div>
              <AvatarSelector v-model="selectedAvatar" />
            </div>
            
            <div class="mb-3">
              <label for="userName" class="form-label">Nombre</label>
              <input type="text" id="userName" v-model="editedName" class="form-control" placeholder="Tu nombre" />
            </div>
            
            <div class="mb-3">
              <label for="userEmail" class="form-label">Email</label>
              <input type="email" id="userEmail" v-model="editedEmail" class="form-control" placeholder="tu@email.com" />
            </div>
            
            <div class="mb-3">
              <label for="userRole" class="form-label">Rol</label>
              <select id="userRole" class="form-select" v-model="editedRole">
                <option value="Administrador">Administrador</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Operador">Operador</option>
                <option value="Técnico">Técnico</option>
              </select>
            </div>
            
            <div class="mb-3">
              <label for="userDepartment" class="form-label">Departamento</label>
              <select id="userDepartment" class="form-select" v-model="editedDepartment">
                <option value="TI">TI</option>
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Operaciones">Operaciones</option>
                <option value="Sistemas Eléctricos">Sistemas Eléctricos</option>
                <option value="Administración">Administración</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeEditProfile">Cancelar</button>
            <button class="btn btn-primary" @click="saveProfile">Guardar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import AvatarSelector from './AvatarSelector.vue'

export default {
  components: {
    AvatarSelector
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
      // Estado de menus
      showProfileMenu: false,
      showEditProfile: false,
      showAvatarSelector: false,
      
      // Datos de edición temporal
      editedName: '',
      editedEmail: '',
      editedRole: 'Técnico',
      editedDepartment: 'Sistemas Eléctricos',
      selectedAvatar: { type: 'icon', value: 'bi-person-circle', icon: 'bi bi-person-circle' },
      
      // Para forzar renderizado
      refreshKey: 0
    }
  },

  mounted() {
    this.loadUserData();
    document.addEventListener('click', this.closeMenu);
  },

  beforeDestroy() {
    document.removeEventListener('click', this.closeMenu);
  },
  
  computed: {
    // Nombre del usuario desde localStorage
    userName() {
      return localStorage.getItem('user') || 'Usuario';
    },
    
    // Email almacenado en localStorage
    userEmail() {
      return localStorage.getItem('userEmail') || '';
    },
    
    // Rol del usuario
    userRole() {
      return localStorage.getItem('userRole') || 'Técnico';
    },
    
    // Departamento del usuario
    userDepartment() {
      return localStorage.getItem('userDepartment') || 'Sistemas Eléctricos';
    },
    
    // Avatar actual del usuario - siempre fresco desde localStorage
    currentAvatarClass() {
      try {
        const avatarData = JSON.parse(localStorage.getItem('userAvatar'));
        if (avatarData && avatarData.value) {
          return `bi ${avatarData.value}`;
        }
      } catch (e) {
        console.error('Error obteniendo avatar:', e);
      }
      return 'bi bi-person-circle';
    }
  },

  methods: {
    // Toggle para el modo oscuro
    toggleTheme() {
      this.$emit('toggle-theme');
    },
    
    // Cargar datos del usuario desde localStorage
    loadUserData() {
      this.editedName = this.userName;
      this.editedEmail = this.userEmail;
      this.editedRole = this.userRole;
      this.editedDepartment = this.userDepartment;
      
      try {
        const savedAvatar = JSON.parse(localStorage.getItem('userAvatar'));
        if (savedAvatar) {
          this.selectedAvatar = JSON.parse(JSON.stringify(savedAvatar));
        }
      } catch (e) {
        console.error('Error al cargar avatar:', e);
      }
    },
    
    toggleProfileMenu() {
      this.showProfileMenu = !this.showProfileMenu;
      // Forzar actualización para refrescar el avatar
      if (this.showProfileMenu) {
        this.refreshKey++;
      }
    },

    showEditProfileModal() {
      this.showProfileMenu = false;
      this.showEditProfile = true;
      this.showAvatarSelector = false;
      this.loadUserData();
    },
    
    showSettingsModal() {
      // Placeholder para futura funcionalidad de configuración
      this.showProfileMenu = false;
      alert('Funcionalidad de configuración en desarrollo');
    },
    
    closeEditProfile() {
      this.showEditProfile = false;
      this.showAvatarSelector = false;
    },
    
    saveProfile() {
      // Guardar datos en localStorage
      localStorage.setItem('user', this.editedName);
      localStorage.setItem('userEmail', this.editedEmail);
      localStorage.setItem('userRole', this.editedRole);
      localStorage.setItem('userDepartment', this.editedDepartment);
      localStorage.setItem('userAvatar', JSON.stringify(this.selectedAvatar));
      
      // Forzar actualización completa del componente
      this.refreshKey++;
      
      // Mostrar feedback
      alert('¡Perfil actualizado correctamente!');
      
      // Cerrar modal y recargar la página para forzar la actualización
      this.showEditProfile = false;
      window.location.reload();
    },
    
    // Cerrar sesión
    logout() {
      // Limpiar autenticación
      localStorage.removeItem('isAuthenticated');
      
      // Mantener los datos de usuario para futuras sesiones
      
      // Redirigir al login
      window.location.href = '/login';
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

.user-avatar {
  background: #1e4d92;
  color: #fff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

/* Menú desplegable del perfil */
.profile-menu {
  position: absolute;
  top: 45px;
  right: 0;
  width: 220px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 1050;
  overflow: hidden;
}

.profile-header {
  padding: 15px;
  background: #f5f5f5;
  border-bottom: 1px solid #eee;
}

.profile-name {
  display: block;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.profile-email {
  display: block;
  font-size: 0.8rem;
  color: #777;
}

.menu-item {
  padding: 10px 15px;
  cursor: pointer;
  transition: background 0.2s;
}

.menu-item:hover {
  background: #f5f5f5;
}

/* Foto de perfil */
.profile-pic {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border: 2px solid #1e4d92;
}

.avatar-selector-container {
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  padding: 0.75rem;
  background-color: #f8f9fa;
}

/* Modal de edición de perfil */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-dialog {
  width: 95%;
  max-width: 500px;
  margin: 1.75rem auto;
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