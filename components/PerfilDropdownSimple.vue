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
          <p><strong>Rol:</strong> {{ usuario.nombre || 'Tecnico' }}</p>
          <p><strong>Email:</strong> {{ usuario.email }}</p>

          <button @click="editarPerfil" class="btn">Editar Perfil</button>
          <button @click="cerrarSesion" class="btn btn-logout">Cerrar Sesión</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { signOut } from 'firebase/auth'
import { useNuxtApp } from '#app'

export default {
  name: 'PerfilDropdownSimple',
  setup() {
    const { $auth } = useNuxtApp()

    const menuOpen = ref(false)
    const usuario = ref({
      nombre: '',
      email: '',
      photoURL: '',
    })

    onMounted(() => {
      const user = $auth.currentUser
      if (user) {
        usuario.value.nombre = user.displayName || ''
        usuario.value.email = user.email || ''
        usuario.value.photoURL = user.photoURL || ''
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
      alert('Aquí abres el formulario para editar perfil (email/contraseña)')
      menuOpen.value = false
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
      usuario,
      toggleMenu,
      cerrarSesion,
      editarPerfil,
      usuarioInicial,
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

.profile-name {
  font-weight: 600;
  color: var(--text-color, #222);
}

.arrow {
  transition: transform 0.3s ease;
}

.arrow.open {
  transform: rotate(180deg);
}

/* Dropdown card encima */
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

/* Animación fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
