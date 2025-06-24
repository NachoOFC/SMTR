<template>
  <div>
    <!-- Sidebar para pantallas medianas y grandes -->
    <aside class="sidebar d-none d-md-flex">
      <div class="logo-section">
        <img src="/SMTR.png" alt="Logo SMTR" class="sidebar-logo" />
        <button class="btn btn-sm btn-outline-info ms-2 toggle-modo-btn" @click="toggleModo">
          <i :class="demoData.modo === 'usuario' ? 'bi bi-person-fill' : 'bi bi-tools'" style="font-size:1.2em;"></i>
          <span class="d-none d-lg-inline ms-1">{{ demoData.modo === 'usuario' ? 'Usuario' : 'Técnico' }}</span>
        </button>
      </div>
      <nav class="menu">
        <ul>
          <li>
            <NuxtLink to="/principal" class="menu-link" active-class="active">
              <i class="bi bi-house-door-fill icon"></i> Principal
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/alertas" class="menu-link" active-class="active">
              <i class="bi bi-bell-fill icon"></i> Alertas
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/historial" class="menu-link" active-class="active">
              <i class="bi bi-clipboard-data-fill icon"></i> Historial
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/reportes" class="menu-link" active-class="active">
              <i class="bi bi-file-earmark-text-fill icon"></i> Reportes
            </NuxtLink>
          </li>
           <li>
            <NuxtLink to="/graficos" class="menu-link" active-class="active">
              <i class="bi bi-graph-up-arrow icon"></i> Gráficos
            </NuxtLink>
          </li>
          <li v-if="demoData.modo === 'tecnico'">
            <NuxtLink to="/solicitudes" class="menu-link" active-class="active">
              <i class="bi bi-inbox-fill icon"></i> Solicitudes
            </NuxtLink>
          </li>
          <!-- <li>
            <NuxtLink to="/activos" class="menu-link" active-class="active">
              <i class="bi bi-hdd-rack-fill icon"></i> Activos
            </NuxtLink>
          </li> -->
        </ul>
      </nav>
      <div class="sidebar-bottom">
        <NuxtLink to="/ayuda" class="help menu-link" active-class="active">
          <i class="bi bi-question-circle-fill icon"></i> Ayuda
        </NuxtLink>
        <a href="#" @click.prevent="logout" class="logout menu-link">
          <i class="bi bi-box-arrow-left icon"></i> Log Out
        </a>
      </div>
    </aside>

    <!-- Navbar mobile para pantallas pequeñas -->
    <nav class="navbar navbar-dark bg-primary fixed-bottom d-md-none">
      <div class="container-fluid">
        <div class="navbar-mobile-menu">
          <NuxtLink
            to="/principal"
            class="navbar-mobile-item"
            active-class="active"
          >
            <i class="bi bi-house-door-fill"></i>
            <span>Principal</span>
          </NuxtLink>
          <NuxtLink
            to="/alertas"
            class="navbar-mobile-item"
            active-class="active"
          >
            <i class="bi bi-bell-fill"></i>
            <span>Alertas</span>
          </NuxtLink>
          <NuxtLink
            to="/graficos"
            class="navbar-mobile-item"
            active-class="active"
          >
            <i class="bi bi-graph-up-arrow"></i>
            <span>Gráficos</span>
          </NuxtLink>
          <NuxtLink
            to="/historial"
            class="navbar-mobile-item"
            active-class="active"
          >
            <i class="bi bi-clipboard-data-fill"></i>
            <span>Historial</span>
          </NuxtLink>
          <!-- <NuxtLink
            to="/activos"
            class="navbar-mobile-item"
            active-class="active"
          >
            <i class="bi bi-hdd-rack-fill"></i>
            <span>Activos</span>
          </NuxtLink> -->
          <div class="dropdown dropup">
            <button
              class="navbar-mobile-item dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-three-dots"></i>
              <span>Más</span>
            </button>
            <ul class="dropdown-menu">
              <li>
                <NuxtLink to="/ayuda" class="dropdown-item"
                  ><i class="bi bi-question-circle-fill me-2"></i>
                  Ayuda</NuxtLink
                >
              </li>
              <li>
                <a class="dropdown-item" href="#" @click.prevent="logout"
                  ><i class="bi bi-box-arrow-left me-2"></i> Log Out</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { getAuth, signOut } from "firebase/auth";
import { demoData, toggleModo } from '~/store/demoData.js';

export default {
  data() {
    return {
      userName: "",
      demoData
    };
  },

  mounted() {
    // Obtener el nombre de usuario al cargar el componente
    
  },

  methods: {
    logout() {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          window.location.href = "/login";
        })
        .catch((error) => {
          // An error happened.
        });
    },
    toggleModo() {
      toggleModo();
    }
  },
};
</script>

<style scoped>
.sidebar {
  background: #2c3e50;
  color: #fff;
  width: 220px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem 0.5rem;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1030;
  transition: all 0.3s ease;
}

.logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  padding-left: 0.5rem;
}

.sidebar-logo {
  height: 80px;
  width: auto;
}

.menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu li {
  margin: 0.5rem 0;
}

.menu-link {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1.1rem;
  text-decoration: none;
  color: #fff;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background 0.2s;
}

.menu-link:hover,
.menu-link.active {
  background: rgba(255, 255, 255, 0.1);
}

.sidebar-bottom {
  margin-top: 2rem;
}

.help,
.logout {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin: 0.5rem 0;
  cursor: pointer;
}

/* Estilos para la navegación móvil */
.navbar-mobile-menu {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
}

.navbar-mobile-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  text-decoration: none;
  font-size: 0.75rem;
  padding: 0.4rem 0;
  border: none;
  background: transparent;
}

.navbar-mobile-item i {
  font-size: 1.3rem;
  margin-bottom: 0.2rem;
}

.navbar-mobile-item.active {
  color: rgba(255, 255, 255, 0.8);
}

.dropdown-menu {
  margin-bottom: 10px;
}

/* Para pantallas muy pequeñas */
@media (max-width: 360px) {
  .navbar-mobile-item span {
    font-size: 0.7rem;
  }

  .navbar-mobile-item i {
    font-size: 1.1rem;
  }
}

/* Media query para ocultar el sidebar en móviles */
@media (max-width: 767.98px) {
  .sidebar {
    transform: translateX(-100%);
  }
}

.toggle-modo-btn {
  margin-left: 0.5rem;
  font-size: 0.95rem;
  padding: 0.3rem 0.7rem;
  border-radius: 0.7rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: #fff;
  color: #1e4d92;
  border: 1px solid #1e4d92;
  transition: background 0.2s, color 0.2s;
}
.toggle-modo-btn:hover {
  background: #1e4d92;
  color: #fff;
}
</style>
