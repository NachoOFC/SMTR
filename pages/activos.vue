<template>
  <div :class="['dashboard']">
    <Sidebar />
    <div class="main-content">
      <Topbar :darkMode="darkMode" @toggle-theme="toggleTheme" />

      <div class="container-fluid px-md-4">
        <h1>Mi Perfil</h1>

        <div v-if="loading" class="asset-card">Cargando perfil...</div>

        <div v-else class="asset-card" style="max-width: 600px;">
          <form @submit.prevent="guardarCambios">
            <div class="mb-4">
              <label class="detail-label">Nombre:</label>
              <input v-model="usuario.nombre" class="input" />
            </div>

            <div class="mb-4">
              <label class="detail-label">Correo:</label>
              <input :value="usuario.email" class="input input-disabled" disabled />
            </div>

            <div class="mb-4">
              <label class="detail-label">Teléfono:</label>
              <input v-model="usuario.telefono" class="input" />
            </div>

            <div class="mb-4">
              <label class="detail-label">Dirección:</label>
              <input v-model="usuario.direccion" class="input" />
            </div>

            <div class="mb-4">
              <label class="detail-label">Rol:</label>
              <input :value="usuario.rol || 'Usuario'" class="input input-disabled" disabled />
            </div>

            <div class="asset-actions mt-4">
              <button type="submit" class="btn-asset">Guardar Cambios</button>
              <button type="button" class="btn-asset" @click="cerrarSesion">Cerrar Sesión</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '~/components/Sidebar.vue'
import Topbar from '~/components/Topbar.vue'

import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore'

const darkMode = ref(false)
const loading = ref(true)
const usuario = ref({
  nombre: '',
  email: '',
  telefono: '',
  direccion: '',
  rol: '',
})

const auth = getAuth()
const db = getFirestore()
const router = useRouter()

// Aplica o quita clase dark-mode en <body>
function toggleBodyDarkClass() {
  if (darkMode.value) {
    document.body.classList.add('dark-mode')
  } else {
    document.body.classList.remove('dark-mode')
  }
}

onMounted(() => {
  darkMode.value = localStorage.getItem('darkMode') === 'true'
  toggleBodyDarkClass()

  onAuthStateChanged(auth, async (user) => {
    if (!user) return router.push('/login')

    try {
      const docRef = doc(db, 'usuarios', user.uid)
      const docSnap = await getDoc(docRef)

      usuario.value.email = user.email

      if (docSnap.exists()) {
        const data = docSnap.data()
        usuario.value = {
          ...data,
          email: user.email,
          nombre: data.nombre || user.displayName || '',
        }
      } else {
        usuario.value.nombre = user.displayName || ''
      }
    } catch (error) {
      console.error('Error al cargar datos:', error)
    } finally {
      loading.value = false
    }
  })
})

function toggleTheme() {
  darkMode.value = !darkMode.value
  localStorage.setItem('darkMode', darkMode.value)
  toggleBodyDarkClass()
}

async function guardarCambios() {
  const user = auth.currentUser
  if (!user) return

  try {
    await updateDoc(doc(db, 'usuarios', user.uid), {
      nombre: usuario.value.nombre,
      telefono: usuario.value.telefono,
      direccion: usuario.value.direccion,
    })
    alert('Perfil actualizado correctamente.')
  } catch (e) {
    alert('Error al guardar cambios: ' + e.message)
  }
}

function cerrarSesion() {
  signOut(auth).then(() => router.push('/login'))
}
</script>

<style scoped>
.dashboard {
  position: relative;
  min-height: 100vh;
  background: var(--background-color, #f5f5f5);
  display: flex;
}

/* Sidebar fijo y encima */
.dashboard > *:first-child {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  background-color: #1e4d92;
  z-index: 1000;
  overflow-y: auto;
  color: white;
}

/* Contenido principal con margen para que no quede debajo del sidebar */
.main-content {
  margin-left: 250px;
  flex: 1;
  overflow-y: auto;
  padding: 1rem 2rem;
  background-color: var(--background-color, white);
  min-height: 100vh;
}

.container-fluid {
  padding-top: 1rem;
}

/* Inputs */
.input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-top: 5px;
  background-color: white;
  color: black;
}

.input-disabled {
  background-color: #eee;
  color: #777;
}

.dark-mode .input {
  background-color: #272741;
  color: #f0f0f0;
  border-color: #3a3a55;
}

.dark-mode .input-disabled {
  background-color: #333353;
  color: #aaa;
}

.detail-label {
  font-weight: 600;
  color: #555;
  display: block;
  margin-bottom: 4px;
}

.dark-mode .detail-label {
  color: #f0f0f0;
}

.asset-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.dark-mode .asset-card {
  background: #272741;
  color: #f0f0f0;
}

.asset-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-asset {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  background-color: #1e4d92;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-asset:hover {
  background-color: #163a6f;
}
</style>

<style>
/* Estilos globales para modo oscuro en <body> */
body.dark-mode {
  background-color: #1f1f2e;
  color: #f0f0f0;
  transition: background-color 0.3s ease;
}

body.dark-mode input {
  background-color: #272741;
  color: #f0f0f0;
  border-color: #3a3a55;
}

body.dark-mode .input-disabled {
  background-color: #333353;
  color: #aaa;
}

body.dark-mode .detail-label {
  color: #f0f0f0;
}

body.dark-mode .asset-card {
  background: #272741;
  color: #f0f0f0;
}
</style>
