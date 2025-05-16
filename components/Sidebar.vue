<template>
  <aside class="sidebar">
    <div class="logo-section">
      <span class="logo-icon">⚡</span>
      <span class="logo-text">SMTR</span>
    </div>
    <nav class="menu">
      <ul>
        <li>
          <NuxtLink to="/" class="menu-link" active-class="active">
            <span class="icon">🏠</span> Home
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/alertas" class="menu-link" active-class="active">
            <span class="icon">🔔</span> Alertas
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/historial" class="menu-link" active-class="active">
            <span class="icon">📋</span> Historial
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/activos" class="menu-link" active-class="active">
            <span class="icon">💼</span> Activos
          </NuxtLink>
        </li>
      </ul>
    </nav>
    <div class="sidebar-bottom">
      <NuxtLink to="/ayuda" class="help menu-link" active-class="active">
        <span class="icon">❓</span> Ayuda
      </NuxtLink>
      <a href="#" @click.prevent="logout" class="logout menu-link">
        <span class="icon">↩️</span> Log Out
      </a>
    </div>
  </aside>
</template>

<script>
export default {
  props: {
    // No props por ahora
  },

  data() {
    return {
      // No data por ahora
    }
  },

  methods: {
    // Función simulada de logout
    logout() {
      alert('Sesión cerrada (simulación)')
    }
  }
}
</script>

<style scoped>
.sidebar {
  background: #5b8ac6;
  color: #fff;
  width: 200px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem 0.5rem;
}
.logo-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 2rem;
}
.menu ul {
  list-style: none;
  padding: 0;
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

.menu-link:hover, .menu-link.active {
  background: rgba(255,255,255,0.2);
}

.sidebar-bottom {
  margin-top: 2rem;
}
.help, .logout {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin: 0.5rem 0;
  cursor: pointer;
}
</style> 