<template>
  <header class="topbar">
    <div class="search-section">
      <input type="text" placeholder="Buscar..." class="search-input" />
      <button class="search-btn">🔍</button>
      <button class="close-btn">✖️</button>
    </div>
    <div class="user-avatar" @click="toggleProfileMenu">
      <span class="avatar-icon">👤</span>
      <div v-if="showProfileMenu" class="profile-menu">
        <div class="profile-header">
          <span class="profile-name">{{ userName }}</span>
          <span class="profile-email">{{ userEmail }}</span>
        </div>
        <div class="menu-item" @click="showEditProfileModal">Mi perfil</div>
        <div class="menu-item">Configuración</div>
        <div class="menu-item">Cerrar sesión</div>
      </div>
    </div>

    <!-- Modal de Edición de Perfil -->
    <div v-if="showEditProfile" class="profile-modal-overlay" @click="closeEditProfile">
      <div class="profile-modal" @click.stop>
        <div class="modal-header">
          <h2>Editar Perfil</h2>
          <button class="close-modal" @click="closeEditProfile">✖️</button>
        </div>
        <div class="modal-body">
          <div class="profile-pic-section">
            <div class="profile-pic">👤</div>
            <button class="change-pic-btn">Cambiar foto</button>
          </div>
          
          <div class="form-group">
            <label for="userName">Nombre</label>
            <input type="text" id="userName" v-model="editedName" class="form-input" placeholder="Tu nombre" />
          </div>
          
          <div class="form-group">
            <label for="userEmail">Email</label>
            <input type="email" id="userEmail" v-model="editedEmail" class="form-input" placeholder="tu@email.com" />
          </div>
          
          <div class="form-group">
            <label for="userRole">Rol</label>
            <input type="text" id="userRole" value="Administrador" class="form-input" disabled />
          </div>
          
          <div class="form-group">
            <label for="userDepartment">Departamento</label>
            <select id="userDepartment" class="form-input">
              <option value="it">IT</option>
              <option value="maintenance" selected>Mantenimiento</option>
              <option value="operations">Operaciones</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeEditProfile">Cancelar</button>
          <button class="btn-save" @click="saveProfile">Guardar Cambios</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  props: {
    // No props por ahora
  },

  data() {
    return {
      // Datos de usuario
      userName: 'Usuario Demo',
      userEmail: 'usuario@ejemplo.com',
      
      // Variables para edición
      editedName: 'Usuario Demo',
      editedEmail: 'usuario@ejemplo.com',
      
      // Estado de menus
      showProfileMenu: false,
      showEditProfile: false
    }
  },

  mounted() {
    document.addEventListener('click', this.closeMenu)
  },

  beforeDestroy() {
    document.removeEventListener('click', this.closeMenu)
  },

  methods: {
    toggleProfileMenu() {
      this.showProfileMenu = !this.showProfileMenu
    },

    showEditProfileModal() {
      this.showProfileMenu = false
      this.showEditProfile = true
    },
    
    closeEditProfile() {
      this.showEditProfile = false
      // Resetear valores
      this.editedName = this.userName
      this.editedEmail = this.userEmail
    },
    
    saveProfile() {
      // Actualizar datos
      this.userName = this.editedName
      this.userEmail = this.editedEmail
      
      // Mostrar feedback
      alert('¡Perfil actualizado correctamente!')
      
      // Cerrar modal
      this.showEditProfile = false
    },
    
    // Cerrar el menú al hacer clic fuera
    closeMenu(event) {
      if (this.showProfileMenu && !event.target.closest('.user-avatar')) {
        this.showProfileMenu = false
      }
    }
  }
}
</script>

<style scoped>
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 2rem 0.5rem 2rem;
  background: #fff;
  border-bottom: 1px solid #eee;
}
.search-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.search-input {
  padding: 0.5rem 1rem;
  border-radius: 1.5rem;
  border: 1px solid #ccc;
  outline: none;
  font-size: 1rem;
}
.search-btn, .close-btn {
  background: none;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
}
.user-avatar {
  background: #222;
  color: #fff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  position: relative;
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
  z-index: 100;
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
  font-size: 0.85rem;
  color: #666;
}

.menu-item {
  padding: 12px 15px;
  color: #333;
  cursor: pointer;
  transition: background 0.2s;
}

.menu-item:hover {
  background: #f0f0f0;
}

/* Modal de Edición de Perfil */
.profile-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.profile-modal {
  background: white;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.modal-header {
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
}

.close-modal {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #777;
  cursor: pointer;
}

.modal-body {
  padding: 1.5rem;
}

.profile-pic-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.profile-pic {
  background: #333;
  color: white;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  margin-bottom: 1rem;
}

.change-pic-btn {
  background: none;
  border: 1px solid #5b8ac6;
  color: #5b8ac6;
  padding: 0.5rem 1rem;
  border-radius: 1.2rem;
  cursor: pointer;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
}

.form-input {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-cancel {
  padding: 0.7rem 1.5rem;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  cursor: pointer;
}

.btn-save {
  padding: 0.7rem 1.5rem;
  background: #5b8ac6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}
</style> 