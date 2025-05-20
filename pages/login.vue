<template>
  <div v-if="isClient" class="login-container" :class="{ 'dark-mode': isDarkMode }">
    <div class="login-box">
      <div class="logo-container">
        <i class="bi bi-lightning-charge-fill"></i>
      </div>
      <h2>SMTR</h2>
      <p class="subtitle">Sistema de Monitoreo en Tiempo Real</p>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">
            <i class="bi bi-envelope-fill"></i>
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            placeholder="Ingrese su correo electrónico"
          />
        </div>
        <div class="form-group">
          <label for="password">
            <i class="bi bi-key-fill"></i>
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="Ingrese su contraseña"
          />
        </div>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <button type="submit" class="login-btn" :disabled="isLoading">
          <span v-if="isLoading" class="spinner"></span>
          {{ isLoading ? "Ingresando..." : "Iniciar Sesión" }}
        </button>
      </form>
    </div>
    <button class="theme-toggle" @click="toggleTheme">
      <i :class="isDarkMode ? 'bi bi-sun-fill' : 'bi bi-moon-fill'"></i>
    </button>
  </div>
  <div v-else class="login-loader">
    <div class="spinner-border text-primary" role="status"></div>
    <p class="mt-3">Cargando...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const isClient = ref(false);
const router = useRouter();
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const isLoading = ref(false);
const isDarkMode = ref(false);

let auth = null;
let signInWithEmailAndPassword = null;
let onAuthStateChanged = null;

onMounted(async () => {
  isClient.value = true;
  if (typeof window !== "undefined") {
    const firebaseAuth = await import("firebase/auth");
    auth = firebaseAuth.getAuth();
    signInWithEmailAndPassword = firebaseAuth.signInWithEmailAndPassword;
    onAuthStateChanged = firebaseAuth.onAuthStateChanged;

    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/principal");
      } else {
        localStorage.removeItem("isAuthenticated");
      }
    });

    isDarkMode.value = localStorage.getItem("darkMode") === "true";
    if (isDarkMode.value) document.body.classList.add("dark-mode");
  }
});

const handleLogin = async () => {
  if (!auth || !signInWithEmailAndPassword) return;
  isLoading.value = true;
  errorMessage.value = "";
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    const user = userCredential.user;
    localStorage.setItem(
      "user",
      JSON.stringify({ uid: user.uid, email: user.email })
    );
    localStorage.setItem("isAuthenticated", "true");
    router.push("/principal");
  } catch (error) {
    switch (error.code) {
      case "auth/invalid-email":
        errorMessage.value = "El correo electrónico no es válido";
        break;
      case "auth/user-disabled":
        errorMessage.value = "Esta cuenta ha sido deshabilitada";
        break;
      case "auth/user-not-found":
        errorMessage.value = "No existe una cuenta con este correo electrónico";
        break;
      case "auth/wrong-password":
        errorMessage.value = "Contraseña incorrecta";
        break;
      default:
        errorMessage.value =
          "Error al iniciar sesión. Por favor, intente nuevamente";
    }
  } finally {
    isLoading.value = false;
  }
};

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", isDarkMode.value);
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1e4d92, #2c3e50);
  position: relative;
}

.login-box {
  background: rgba(255, 255, 255, 0.95);
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  backdrop-filter: blur(10px);
}

.logo-container {
  text-align: center;
  margin-bottom: 1.5rem;
}

.logo-container i {
  font-size: 3rem;
  color: #1e4d92;
  background: #f0f4f8;
  padding: 1rem;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(30, 77, 146, 0.2);
}

.login-box h2 {
  text-align: center;
  margin-bottom: 0.5rem;
  color: #1e4d92;
  font-size: 2rem;
  font-weight: 700;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #444;
  font-weight: 500;
}

.form-group label i {
  color: #1e4d92;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  border-color: #1e4d92;
  box-shadow: 0 0 0 3px rgba(30, 77, 146, 0.1);
  outline: none;
}

.login-btn {
  width: 100%;
  padding: 0.875rem;
  background: #1e4d92;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.login-btn:hover {
  background: #163a6f;
  transform: translateY(-1px);
}

.login-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid #ffffff;
  border-top: 3px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  color: #dc3545;
  margin-bottom: 1rem;
  text-align: center;
  padding: 0.5rem;
  background: rgba(220, 53, 69, 0.1);
  border-radius: 6px;
}

.theme-toggle {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  cursor: pointer;
  color: white;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

/* Dark mode styles */
.dark-mode {
  background: linear-gradient(135deg, #121224, #1a1a2e);
}

.dark-mode .login-box {
  background: rgba(45, 45, 45, 0.95);
}

.dark-mode .logo-container i {
  color: #4d92e0;
  background: #1a1a2e;
}

.dark-mode .login-box h2 {
  color: #4d92e0;
}

.dark-mode .subtitle {
  color: #a0a0b0;
}

.dark-mode .form-group label {
  color: #e0e0e0;
}

.dark-mode .form-group label i {
  color: #4d92e0;
}

.dark-mode .form-group input {
  background: #2d2d2d;
  border-color: #3a3a55;
  color: #fff;
}

.dark-mode .form-group input:focus {
  border-color: #4d92e0;
  box-shadow: 0 0 0 3px rgba(77, 146, 224, 0.1);
}

.dark-mode .login-btn {
  background: #4d92e0;
}

.dark-mode .login-btn:hover {
  background: #3a7bc8;
}

.dark-mode .error-message {
  background: rgba(220, 53, 69, 0.2);
}

@media (max-width: 480px) {
  .login-box {
    margin: 1rem;
    padding: 1.5rem;
  }

  .theme-toggle {
    top: 1rem;
    right: 1rem;
  }
}
</style>
