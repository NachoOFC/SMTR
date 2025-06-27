<template>
  <div>
    <!-- Sidebar para pantallas medianas y grandes -->
    <aside class="sidebar d-none d-md-flex">
      <div class="logo-section">
        <img src="/SMTR.png" alt="Logo SMTR" class="sidebar-logo" />
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
          <li>
            <NuxtLink to="/mantenimientos" class="menu-link" active-class="active">
              <i class="bi bi-wrench-adjustable-circle icon"></i> Mantenimientos
            </NuxtLink>
          </li>
          <li v-if="demoData.modo === 'tecnico'">
            <NuxtLink to="/solicitudes" class="menu-link" active-class="active">
              <i class="bi bi-inbox-fill icon"></i> Solicitudes
            </NuxtLink>
          </li>
           <!-- <li>
            <NuxtLink to="/activos" class="menu-link" active-class="active">
              <i class="bi bi-hdd-rack-fill icon"></i> Perfil
            </NuxtLink>
          </li> -->
        </ul>
      </nav>
      <div class="sidebar-bottom">
        <NuxtLink to="/ayuda" class="help menu-link" active-class="active">
          <i class="bi bi-question-circle-fill icon"></i> Ayuda
        </NuxtLink>
        <a href="#" @click.prevent="logout" class="logout menu-link">
          <i class="bi bi-box-arrow-left icon"></i> SALIR
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
                  ><i class="bi bi-box-arrow-left me-2"></i> SALIR</a
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
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #bdc3c7;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  font-weight: 500;
}

.menu-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.menu-link:hover::before {
  left: 100%;
}

.menu-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.menu-link.active {
  color: #fff;
  background: linear-gradient(135deg, #3498db, #2980b9);
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
  transform: translateX(4px);
}

.menu-link.active::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background: #fff;
  border-radius: 2px 0 0 2px;
}

.icon {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.menu-link:hover .icon {
  transform: scale(1.1);
}

.menu-link.active .icon {
  transform: scale(1.1);
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
</style>
