<template>
  <div :class="['dashboard', darkMode ? 'dark-mode' : '']">
    <Sidebar />
    <div class="main-content">
      <Topbar :darkMode="darkMode" @toggle-theme="toggleTheme" />
      <div class="container-fluid px-md-4">
        <h1>Ayuda y Soporte</h1>
        
        <div class="help-container">
          <div class="help-tabs">
            <div class="tab active">Preguntas Frecuentes</div>
            <div class="tab">Manual de Usuario</div>
            <div class="tab">Contacto Soporte</div>
          </div>
          
          <div class="help-content">
            <h2>Preguntas Frecuentes</h2>
            
            <div class="faq-item">
              <div class="faq-question">
                <h3>¿Cómo se interpretan los indicadores de estado?</h3>
                <span class="expand-icon">+</span>
              </div>
              <div class="faq-answer">
                <p>Los indicadores de estado siguen un código de colores:</p>
                <ul>
                  <li><span class="color-dot green"></span> <strong>Verde (Bueno):</strong> El dispositivo funciona correctamente.</li>
                  <li><span class="color-dot yellow"></span> <strong>Amarillo (Precaución):</strong> El dispositivo requiere atención, pero no es crítico.</li>
                  <li><span class="color-dot red"></span> <strong>Rojo (Crítico):</strong> Requiere atención inmediata, hay un problema grave.</li>
                </ul>
              </div>
            </div>
            
            <div class="faq-item">
              <div class="faq-question">
                <h3>¿Con qué frecuencia se actualizan los datos?</h3>
                <span class="expand-icon">+</span>
              </div>
              <div class="faq-answer">
                <p>Los datos se actualizan de la siguiente manera:</p>
                <ul>
                  <li>Indicadores críticos: Cada 30 segundos</li>
                  <li>Indicadores de temperatura: Cada 2 minutos</li>
                  <li>Indicadores de vibración: Cada 5 minutos</li>
                  <li>Estado de la batería: Cada 10 minutos</li>
                </ul>
              </div>
            </div>
            
            <div class="faq-item">
              <div class="faq-question">
                <h3>¿Cómo puedo exportar el historial de eventos?</h3>
                <span class="expand-icon">+</span>
              </div>
              <div class="faq-answer">
                <p>Para exportar el historial de eventos:</p>
                <ol>
                  <li>Vaya a la sección "Historial"</li>
                  <li>Utilice los filtros para seleccionar el rango de fechas deseado</li>
                  <li>Haga clic en el botón "Exportar" (icono de descarga)</li>
                  <li>Elija el formato deseado (CSV, PDF o Excel)</li>
                  <li>Confirme la descarga</li>
                </ol>
                <p>La descarga comenzará automáticamente.</p>
              </div>
            </div>
            
            <div class="faq-item">
              <div class="faq-question">
                <h3>¿Puedo configurar notificaciones personalizadas?</h3>
                <span class="expand-icon">+</span>
              </div>
              <div class="faq-answer">
                <p>Sí, puede configurar notificaciones personalizadas según sus necesidades:</p>
                <ol>
                  <li>Vaya a su perfil de usuario (clic en el icono de avatar)</li>
                  <li>Seleccione "Configuración" > "Notificaciones"</li>
                  <li>Elija los tipos de alertas, niveles de gravedad y canales de notificación</li>
                  <li>Establezca horarios específicos si lo desea</li>
                  <li>Guarde los cambios</li>
                </ol>
              </div>
            </div>
          </div>
          
          <div class="support-contact">
            <h3>¿No encuentra lo que busca?</h3>
            <p>Nuestro equipo de soporte está disponible para ayudarle.</p>
            <div class="contact-methods">
              <div class="contact-method">
                <div class="contact-icon">📞</div>
                <div>
                  <h4>Teléfono</h4>
                  <p>+56 2 2123 4567</p>
                  <p>Lun-Vie: 9:00 - 18:00</p>
                </div>
              </div>
              
              <div class="contact-method">
                <div class="contact-icon">📧</div>
                <div>
                  <h4>Email</h4>
                  <p>soporte@smtr.cl</p>
                  <p>Tiempo resp: 24 horas</p>
                </div>
              </div>
              
              <div class="contact-method">
                <div class="contact-icon">💬</div>
                <div>
                  <h4>Chat</h4>
                  <button class="chat-button">Iniciar Chat</button>
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
import Sidebar from '~/components/Sidebar.vue'
import Topbar from '~/components/Topbar.vue'

export default {
  components: {
    Sidebar,
    Topbar
  },

  data() {
    return {
      darkMode: false
    }
  },

  mounted() {
    // Verificar autenticación al cargar la página
    if (process.client) {
      try {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        if (!isAuthenticated) {
          // Redirigir a login si no está autenticado
          window.location.href = '/login';
        }
        
        // Cargar preferencia de tema oscuro
        this.darkMode = localStorage.getItem('darkMode') === 'true';
      } catch (e) {
        console.error('Error verificando autenticación:', e);
        window.location.href = '/login';
      }
    }
  },
  
  methods: {
    toggleTheme() {
      this.darkMode = !this.darkMode;
      localStorage.setItem('darkMode', this.darkMode);
    }
  }
}
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  background: #f7f7fb;
}

.main-content {
  flex: 1;
  margin-left: 220px;
  transition: all 0.3s ease;
  padding: 0 1rem;
}

h1 {
  color: inherit;
  margin-top: 1.5rem;
}
.help-container {
  margin-top: 1.5rem;
}
.help-tabs {
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid #ddd;
  margin-bottom: 2rem;
}
.tab {
  padding: 1rem 2rem;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  border-bottom: 3px solid transparent;
}
.tab.active {
  color: #5b8ac6;
  border-bottom: 3px solid #5b8ac6;
}
.help-content {
  margin-bottom: 3rem;
}
h2 {
  margin-bottom: 1.5rem;
  color: inherit;
}
.faq-item {
  margin-bottom: 1.2rem;
  border: 1px solid #eee;
  border-radius: 0.5rem;
  overflow: hidden;
}
.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  cursor: pointer;
  background: #f9f9f9;
}
.faq-question h3 {
  margin: 0;
  font-size: 1.1rem;
  color: inherit;
  font-weight: 500;
}
.expand-icon {
  font-size: 1.5rem;
  color: #777;
}
.faq-answer {
  padding: 0 1.5rem 1.5rem 1.5rem;
  background: #fff;
}
.color-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 5px;
}
.green { background: #4caf50; }
.yellow { background: #ff9800; }
.red { background: #f44336; }

.support-contact {
  background: white;
  padding: 2rem;
  border-radius: 0.8rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  text-align: center;
}
.support-contact h3 {
  margin-bottom: 0.5rem;
  color: inherit;
}
.support-contact p {
  margin-bottom: 2rem;
  color: #666;
}
.contact-methods {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
  flex-wrap: wrap;
}
.contact-method {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  text-align: left;
  min-width: 200px;
}
.contact-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 50%;
}
.contact-method h4 {
  margin: 0 0 0.5rem 0;
  color: inherit;
}
.contact-method p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}
.chat-button {
  background: #1e4d92;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-top: 0.5rem;
}

/* Estilos para modo oscuro */
.dark-mode {
  background: #121212;
  color: #f0f0f0;
}

.dark-mode .tab {
  color: #a0a0b0;
}

.dark-mode .tab.active {
  color: #88b5ee;
  border-bottom-color: #88b5ee;
}

.dark-mode .help-tabs {
  border-bottom-color: #3a3a55;
}

.dark-mode .faq-item {
  border-color: #3a3a55;
}

.dark-mode .faq-question {
  background: #272741;
}

.dark-mode .expand-icon {
  color: #a0a0b0;
}

.dark-mode .faq-answer {
  background: #1e1e2e;
}

.dark-mode .support-contact {
  background: #272741;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.dark-mode .support-contact p {
  color: #c0c0d0;
}

.dark-mode .contact-icon {
  background: #1e1e2e;
}

.dark-mode .contact-method p {
  color: #c0c0d0;
}

.dark-mode .chat-button {
  background: #3a3a90;
}

@media (max-width: 767.98px) {
  .main-content {
    margin-left: 0;
    margin-bottom: 60px;
    padding: 0;
  }
  
  .container-fluid {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  
  .help-tabs {
    overflow-x: auto;
    white-space: nowrap;
    gap: 0;
  }
  
  .tab {
    padding: 0.8rem 1.2rem;
  }
  
  .contact-methods {
    flex-direction: column;
    align-items: center;
  }
  
  .contact-method {
    width: 100%;
  }
}
</style> 