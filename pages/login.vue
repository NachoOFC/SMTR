<template>
  <div :class="['login-page', isDarkMode ? 'dark-mode' : '']">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="login-card mt-5">
            <div class="card shadow-lg">
              <div class="card-body p-4 p-md-5">
                <div class="text-center mb-4">
                  <h2 class="login-title">SMTR</h2>
                  <p class="login-subtitle">Sistema de Monitoreo en Tiempo Real</p>
                  <div class="logo-container">
                    <div class="logo-circle">
                      <i class="bi bi-lightning-charge-fill"></i>
                    </div>
                  </div>
                </div>
                
                <form @submit.prevent="onLogin">
                  <div class="mb-4">
                    <label for="username" class="form-label">Usuario</label>
                    <div class="input-group">
                      <span class="input-group-text"><i class="bi bi-person-fill"></i></span>
                      <input 
                        type="text" 
                        id="username" 
                        v-model="username" 
                        class="form-control" 
                        placeholder="Ingrese su usuario" 
                        required 
                      />
                    </div>
                    <small v-if="showError" class="text-danger">Usuario o contraseña incorrectos</small>
                  </div>
                  
                  <div class="mb-4">
                    <label for="password" class="form-label">Contraseña</label>
                    <div class="input-group">
                      <span class="input-group-text"><i class="bi bi-key-fill"></i></span>
                      <input 
                        type="password" 
                        id="password" 
                        v-model="password" 
                        class="form-control" 
                        placeholder="Ingrese su contraseña" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <button type="submit" class="btn btn-primary w-100 py-2 mt-3" :disabled="isLoading">
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {{ isLoading ? 'Ingresando...' : 'Ingresar' }}
                  </button>
                </form>
                
                <div class="mt-4 text-center">
                  <button 
                    class="btn btn-sm btn-outline-secondary theme-toggle"
                    @click="toggleTheme"
                  >
                    <i :class="isDarkMode ? 'bi bi-sun-fill' : 'bi bi-moon-fill'"></i>
                    {{ isDarkMode ? 'Modo claro' : 'Modo oscuro' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      isLoading: false,
      showError: false,
      isDarkMode: true
    }
  },

  mounted() {
    // Al cargar el componente de login, asegurarse de que no haya sesión activa
    localStorage.removeItem('isAuthenticated');
    
    // Preservar datos de perfil si existen, o crearlos con valores por defecto si no
    if (!localStorage.getItem('userAvatar')) {
      localStorage.setItem('userAvatar', JSON.stringify({
        type: 'icon', 
        value: 'bi-person-circle', 
        icon: 'bi bi-person-circle'
      }));
    }
    
    // Usar el nombre de usuario anterior si existe
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.username = savedUser;
    }
    
    // Cargar modo oscuro como predeterminado o según localStorage
    try {
      if (localStorage.getItem('darkMode') === null) {
        localStorage.setItem('darkMode', 'true');
      }
      this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    } catch (e) {
      console.error('Error cargando preferencia de tema:', e);
    }
  },

  methods: {
    onLogin() {
      this.isLoading = true;
      this.showError = false;
      
      // Simulamos una llamada al backend
      setTimeout(() => {
        // Verificamos las credenciales (esto sería reemplazado por una API real)
        // Permitimos cualquier usuario/contraseña (mayúsculas o minúsculas)
        if (this.username.trim() && this.password.trim()) {
          // Autenticación exitosa
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('user', this.username);
          
          // Establecer datos de perfil si no existen
          if (!localStorage.getItem('userRole')) {
            localStorage.setItem('userRole', 'Técnico');
          }
          
          if (!localStorage.getItem('userDepartment')) {
            localStorage.setItem('userDepartment', 'Sistemas Eléctricos');
          }
          
          // Generar un correo electrónico de ejemplo si no existe
          if (!localStorage.getItem('userEmail')) {
            const emailDomain = 'smtr.ejemplo.com';
            const username = this.username.toLowerCase().replace(/\s+/g, '.');
            localStorage.setItem('userEmail', `${username}@${emailDomain}`);
          }
          
          // Redirigimos a la página principal usando window.location para refrescar completamente
          window.location.href = '/principal';
        } else {
          // Autenticación fallida
          this.showError = true;
          this.isLoading = false;
        }
      }, 1000);
    },
    
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      
      // Guardar la preferencia en localStorage
      if (process.client) {
        localStorage.setItem('darkMode', this.isDarkMode);
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #1e4d92, #2c3e50);
  background-size: cover;
}

.login-page.dark-mode {
  background: linear-gradient(135deg, #121224, #1a1a2e);
}

.login-title {
  color: #1e4d92;
  font-weight: 700;
  margin-bottom: 5px;
}

.login-subtitle {
  color: #6c757d;
  font-size: 0.9rem;
}

.logo-container {
  margin: 20px 0;
}

.logo-circle {
  width: 80px;
  height: 80px;
  background: #f8f9fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border: 2px solid #1e4d92;
}

.logo-circle i {
  font-size: 2.5rem;
  color: #1e4d92;
}

.card {
  border-radius: 10px;
  border: none;
}

.input-group-text {
  background-color: #f8f9fa;
}

.btn-primary {
  background-color: #1e4d92;
  border-color: #1e4d92;
}

.btn-primary:hover {
  background-color: #163a6f;
  border-color: #163a6f;
}

.theme-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
}

.theme-toggle i {
  font-size: 1.1rem;
}

/* Dark mode styling */
.dark-mode .card {
  background-color: #272741;
  color: #f0f0f0;
}

.dark-mode .login-title {
  color: #4d92e0;
}

.dark-mode .login-subtitle {
  color: #a0a0b0;
}

.dark-mode .logo-circle {
  background: #1a1a2e;
  border-color: #4d92e0;
}

.dark-mode .logo-circle i {
  color: #4d92e0;
}

.dark-mode .input-group-text {
  background-color: #1a1a2e;
  color: #f0f0f0;
  border-color: #3a3a55;
}

.dark-mode .form-control {
  background-color: #1a1a2e;
  border-color: #3a3a55;
  color: #f0f0f0;
}

.dark-mode .form-control:focus {
  background-color: #1a1a2e;
  color: #f0f0f0;
}

.dark-mode .form-label {
  color: #f0f0f0;
}

.dark-mode .btn-outline-secondary {
  color: #f0f0f0;
  border-color: #3a3a55;
}

.dark-mode .btn-outline-secondary:hover {
  background-color: #3a3a55;
  color: #f0f0f0;
}

@media (max-width: 768px) {
  .login-card {
    padding: 0 15px;
  }
  
  .card-body {
    padding: 1.5rem;
  }
}
</style> 