<template>
  <div class="profile-dropdown" ref="dropdown">
    <div class="profile-trigger" @click="toggleMenu">
      <img
        :src="usuario.photoURL || '/perfil.png'"
        alt="Avatar"
        class="avatar"
      />
      <span class="profile-name">{{ usuario.nombre || 'Perfil' }}</span>
      <svg
        class="arrow"
        :class="{ open: menuOpen }"
        viewBox="0 0 20 20"
        fill="currentColor"
        width="12"
        height="12"
      >
        <path
          fill-rule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0l-4.25-4.65a.75.75 0 01.02-1.06z"
          clip-rule="evenodd"
        />
      </svg>
    </div>

    <transition name="fade">
      <div v-if="menuOpen" class="dropdown-card">
        <div class="card-content">
          <p><strong>Nombre:</strong> {{ usuario.nombre || 'Sin nombre' }}</p>
          <p><strong>Rol:</strong> {{ demoData.modo === 'usuario' ? 'Usuario' : 'Técnico' }}</p>
          <p><strong>Email:</strong> {{ usuario.email }}</p>

          <button @click="editarPerfil" class="btn">Editar Perfil</button>
          <button @click="toggleModo" class="btn btn-modo-toggle-green">
            <i :class="demoData.modo === 'usuario' ? 'bi bi-person-fill' : 'bi bi-tools'" style="font-size:1.2em;"></i>
            {{ demoData.modo === 'usuario' ? 'Cambiar a Técnico' : 'Cambiar a Usuario' }}
          </button>
          <button @click="cerrarSesion" class="btn btn-logout">Cerrar Sesión</button>
        </div>
      </div>
    </transition>

    <!-- Modal para editar perfil -->
    <transition name="modal">
      <div v-if="mostrarFormulario" class="modal-overlay" @click="cerrarFormulario">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Editar Perfil</h3>
            <button @click="cerrarFormulario" class="close-btn">&times;</button>
          </div>

          <form @submit.prevent="guardarCambios" class="edit-form">
            <div class="form-group">
              <label for="nuevo-email">Nuevo Email:</label>
              <input
                id="nuevo-email"
                v-model="formulario.nuevoEmail"
                type="email"
                placeholder="Ingresa tu nuevo email"
                required
              />
            </div>

            <div class="form-group">
              <label for="nueva-password">Nueva Contraseña:</label>
              <div class="password-input">
                <input
                  id="nueva-password"
                  v-model="formulario.nuevaPassword"
                  :type="mostrarPassword ? 'text' : 'password'"
                  placeholder="Ingresa tu nueva contraseña (mínimo 6 caracteres)"
                  minlength="6"
                />
                <button 
                  type="button" 
                  @click="mostrarPassword = !mostrarPassword"
                  class="toggle-password"
                >
                  {{ mostrarPassword ? '👁️' : '👁️‍🗨️' }}
                </button>
              </div>
              <small>Deja vacío si no quieres cambiar la contraseña</small>
            </div>

            <div class="form-group">
              <label for="password-actual">Contraseña Actual:</label>
              <div class="password-input">
                <input
                  id="password-actual"
                  v-model="formulario.passwordActual"
                  :type="mostrarPasswordActual ? 'text' : 'password'"
                  placeholder="Ingresa tu contraseña actual para confirmar"
                  required
                />
                <button 
                  type="button" 
                  @click="mostrarPasswordActual = !mostrarPasswordActual"
                  class="toggle-password"
                >
                  {{ mostrarPasswordActual ? '👁️' : '👁️‍🗨️' }}
                </button>
              </div>
            </div>

            <div v-if="error" class="error-message">
              {{ error }}
            </div>

            <div v-if="mensaje" class="success-message">
              {{ mensaje }}
            </div>

            <!-- Botón para verificar email si es necesario -->
            <div v-if="error && error.includes('verificar')" class="verification-section">
              <p class="verification-text">
                ¿No has recibido el email de verificación?
              </p>
              <button 
                type="button" 
                @click="enviarVerificacionEmail" 
                class="btn btn-verification"
                :disabled="enviandoVerificacion"
              >
                {{ enviandoVerificacion ? 'Enviando...' : 'Reenviar Email de Verificación' }}
              </button>
            </div>

            <div class="form-buttons">
              <button type="button" @click="cerrarFormulario" class="btn btn-cancel">
                Cancelar
              </button>
              <button type="submit" class="btn btn-save" :disabled="guardando">
                {{ guardando ? 'Guardando...' : 'Guardar Cambios' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { 
  signOut, 
  updateEmail, 
  updatePassword, 
  reauthenticateWithCredential, 
  EmailAuthProvider,
  sendEmailVerification  // ← AGREGADA ESTA IMPORTACIÓN
} from 'firebase/auth'
import { useNuxtApp } from '#app'
import { demoData, toggleModo } from '~/store/demoData.js';

export default {
  name: 'PerfilDropdownSimple',
  setup() {
    const { $auth } = useNuxtApp()

    const menuOpen = ref(false)
    const mostrarFormulario = ref(false)
    const guardando = ref(false)
    const error = ref('')
    const mensaje = ref('')

    const enviandoVerificacion = ref(false)

    const mostrarPassword = ref(false)
    const mostrarPasswordActual = ref(false)

    const usuario = ref({
      nombre: '',
      email: '',
      photoURL: '',
    })

    const formulario = ref({
      nuevoEmail: '',
      nuevaPassword: '',
      passwordActual: ''
    })

    onMounted(() => {
      const user = $auth.currentUser
      if (user) {
        usuario.value.nombre = user.displayName || ''
        usuario.value.email = user.email || ''
        usuario.value.photoURL = user.photoURL || ''
        formulario.value.nuevoEmail = user.email || '' // Pre-llenar con el email actual
      }
      document.addEventListener('click', onClickOutside)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('click', onClickOutside)
    })

    function toggleMenu(event) {
      event.stopPropagation()
      menuOpen.value = !menuOpen.value
    }

    function onClickOutside(event) {
      if (!event.target.closest('.profile-dropdown')) {
        menuOpen.value = false
      }
    }

    function editarPerfil() {
      mostrarFormulario.value = true
      menuOpen.value = false
      error.value = ''
      mensaje.value = ''
    }

    function cerrarFormulario() {
      mostrarFormulario.value = false
      formulario.value.nuevaPassword = ''
      formulario.value.passwordActual = ''
      error.value = ''
      mensaje.value = ''
    }

    async function enviarVerificacionEmail() {
      enviandoVerificacion.value = true
      error.value = ''
      mensaje.value = ''

      try {
        const user = $auth.currentUser
        if (!user) {
          throw new Error('Usuario no autenticado')
        }

        // ← CAMBIO PRINCIPAL: Usar la función importada en lugar del método del user
        await sendEmailVerification(user)
        mensaje.value = 'Se ha enviado un email de verificación. Revisa tu bandeja de entrada y sigue las instrucciones.'
        
      } catch (err) {
        console.error('Error al enviar verificación:', err)
        error.value = 'Error al enviar el email de verificación: ' + err.message
      } finally {
        enviandoVerificacion.value = false
      }
    }

    async function guardarCambios() {
      guardando.value = true
      error.value = ''
      mensaje.value = ''

      try {
        const user = $auth.currentUser
        if (!user) {
          throw new Error('Usuario no autenticado')
        }

        console.log('Usuario actual:', user.email)
        console.log('Intentando re-autenticar con:', user.email)

        // Verificar que la contraseña actual no esté vacía
        if (!formulario.value.passwordActual.trim()) {
          error.value = 'La contraseña actual es requerida'
          return
        }

        // Primero re-autenticar al usuario
        const credential = EmailAuthProvider.credential(
          user.email,
          formulario.value.passwordActual
        )
        
        console.log('Intentando re-autenticación...')
        await reauthenticateWithCredential(user, credential)
        console.log('Re-autenticación exitosa')

        // Actualizar email si cambió
        if (formulario.value.nuevoEmail !== user.email) {
          console.log('Actualizando email...')
          try {
            await updateEmail(user, formulario.value.nuevoEmail)
            usuario.value.email = formulario.value.nuevoEmail
            console.log('Email actualizado')
          } catch (emailError) {
            // Si el error es de verificación de email, manejamos especialmente
            if (emailError.code === 'auth/operation-not-allowed') {
              // ← CAMBIO: Usar la función importada aquí también
              await sendEmailVerification(user)
              throw new Error('Se ha enviado un email de verificación. Por favor verifica tu email actual antes de cambiarlo.')
            }
            throw emailError
          }
        }

        // Actualizar contraseña si se proporcionó una nueva
        if (formulario.value.nuevaPassword.trim()) {
          console.log('Actualizando contraseña...')
          await updatePassword(user, formulario.value.nuevaPassword)
          console.log('Contraseña actualizada')
        }

        mensaje.value = 'Perfil actualizado correctamente'
        
        // Limpiar el formulario
        formulario.value.nuevaPassword = ''
        formulario.value.passwordActual = ''
        
        // Cerrar el formulario después de 2 segundos
        setTimeout(() => {
          cerrarFormulario()
        }, 2000)

      } catch (err) {
        console.error('Error completo al actualizar perfil:', err)
        console.error('Código de error:', err.code)
        console.error('Mensaje de error:', err.message)
        
        // Manejar diferentes tipos de errores
        switch (err.code) {
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            error.value = 'La contraseña actual es incorrecta. Verifica que sea la contraseña correcta.'
            break
          case 'auth/email-already-in-use':
            error.value = 'Este email ya está en uso por otra cuenta'
            break
          case 'auth/invalid-email':
            error.value = 'El formato del email no es válido'
            break
          case 'auth/weak-password':
            error.value = 'La nueva contraseña debe tener al menos 6 caracteres'
            break
          case 'auth/requires-recent-login':
            error.value = 'Por seguridad, debes cerrar sesión y volver a iniciar sesión antes de cambiar estos datos'
            break
          case 'auth/user-not-found':
            error.value = 'Usuario no encontrado. Inicia sesión nuevamente.'
            break
          case 'auth/too-many-requests':
            error.value = 'Demasiados intentos fallidos. Espera unos minutos antes de intentar nuevamente.'
            break
          case 'auth/operation-not-allowed':
            error.value = 'Para cambiar el email, primero debes verificar tu email actual. Revisa tu bandeja de entrada.'
            break
          default:
            error.value = `Error: ${err.message || 'Error desconocido al actualizar el perfil'}`
        }
      } finally {
        guardando.value = false
      }
    }

    function cerrarSesion() {
      signOut($auth).then(() => {
        window.location.href = '/login'
      })
    }

    const usuarioInicial = computed(() => {
      return usuario.value.nombre
        ? usuario.value.nombre.charAt(0).toUpperCase()
        : 'U'
    })

    return {
      menuOpen,
      mostrarFormulario,
      mostrarPassword,
      mostrarPasswordActual,
      enviandoVerificacion,
      usuario,
      formulario,
      guardando,
      error,
      mensaje,
      toggleMenu,
      cerrarSesion,
      editarPerfil,
      cerrarFormulario,
      guardarCambios,
      enviarVerificacionEmail,
      usuarioInicial,
      demoData,
      toggleModo
    }
  },
}
</script>

<style scoped>
.profile-dropdown {
  position: relative;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.profile-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 32px;
  height: 32px;
  background-color: #1e4d92;
  color: white;
  font-weight: 700;
  font-size: 18px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dark-mode .profile-name {
  font-weight: 600;
  color: #f0f0f0;
}

.arrow {
  transition: transform 0.3s ease;
}

.arrow.open {
  transform: rotate(180deg);
}

/* Dropdown card */
.dropdown-card {
  position: absolute;
  top: 40px;
  right: 0;
  width: 240px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  z-index: 1500;
  padding: 1rem;
  color: #333;
}

.dark-mode .dropdown-card {
  background: #272741;
  color: #f0f0f0;
}

.card-content p {
  margin: 0.5rem 0;
  font-size: 14px;
}

.btn {
  width: 100%;
  padding: 8px;
  margin-top: 10px;
  border: none;
  border-radius: 8px;
  background-color: #1e4d92;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn:hover {
  background-color: #163a6f;
}

.btn-logout {
  background-color: #c0392b;
}

.btn-logout:hover {
  background-color: #a93226;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.dark-mode .modal-content {
  background: #272741;
  color: #f0f0f0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.dark-mode .modal-header {
  border-bottom-color: #444;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.dark-mode .modal-header h3 {
  color: #f0f0f0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.dark-mode .close-btn {
  color: #ccc;
}

.dark-mode .close-btn:hover {
  color: #fff;
}

.edit-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.dark-mode .form-group label {
  color: #f0f0f0;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #1e4d92;
}

.dark-mode .form-group input {
  background: #3a3a5c;
  border-color: #555;
  color: #f0f0f0;
}

.dark-mode .form-group input:focus {
  border-color: #4a90e2;
}

.form-group small {
  display: block;
  margin-top: 0.25rem;
  color: #666;
  font-size: 0.875rem;
}

.dark-mode .form-group small {
  color: #ccc;
}

.password-input {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input input {
  padding-right: 3rem;
}

.toggle-password {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.25rem;
  z-index: 10;
}

.toggle-password:hover {
  opacity: 0.7;
}

.error-message {
  background: #ffe6e6;
  color: #c0392b;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.dark-mode .error-message {
  background: #4a2c2c;
  color: #ff6b6b;
}

.success-message {
  background: #e6f7e6;
  color: #27ae60;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.dark-mode .success-message {
  background: #2c4a2c;
  color: #6bff6b;
}

.verification-section {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  text-align: center;
}

.dark-mode .verification-section {
  background: #4a4a2c;
  border-color: #6a6a3a;
}

.verification-text {
  margin: 0 0 0.75rem 0;
  font-size: 0.9rem;
  color: #856404;
}

.dark-mode .verification-text {
  color: #d4af37;
}

.btn-verification {
  background-color: #e67e22;
  width: 100%;
  padding: 0.75rem;
  margin-top: 0;
}

.btn-verification:hover {
  background-color: #d35400;
}

.btn-verification:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.form-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-cancel {
  background-color: #95a5a6;
  width: auto;
  padding: 0.75rem 1.5rem;
  margin-top: 0;
}

.btn-cancel:hover {
  background-color: #7f8c8d;
}

.btn-save {
  background-color: #27ae60;
  width: auto;
  padding: 0.75rem 1.5rem;
  margin-top: 0;
}

.btn-save:hover {
  background-color: #229954;
}

.btn-save:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

/* Animaciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
  
  .form-buttons {
    flex-direction: column;
  }
  
  .btn-cancel,
  .btn-save {
    width: 100%;
  }
}

.btn-modo-toggle-green {
  background-color: #27ae60;
  color: #fff;
  margin-top: 10px;
}

.btn-modo-toggle-green:hover {
  background-color: #229954;
  color: #fff;
}
</style>