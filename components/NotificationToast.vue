<template>
  <div class="notifications-container">
    <TransitionGroup 
      name="notification" 
      tag="div" 
      class="notifications-wrapper"
    >
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['notification', `notification-${notification.type}`]"
        @click="removeNotification(notification.id)"
      >
        <div class="notification-icon">
          <i :class="getIcon(notification.type)"></i>
        </div>
        <div class="notification-content">
          <p class="notification-message">{{ notification.message }}</p>
        </div>
        <button 
          class="notification-close"
          @click.stop="removeNotification(notification.id)"
        >
          ×
        </button>
        <div 
          class="notification-progress"
          :style="{ animationDuration: `${notification.duration}ms` }"
        ></div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script>
import { useNotifications } from '~/composables/useNotifications.js'

export default {
  name: 'NotificationToast',
  setup() {
    const { notifications, removeNotification } = useNotifications()
    
    const getIcon = (type) => {
      const icons = {
        success: 'bi bi-check-circle-fill',
        error: 'bi bi-x-circle-fill',
        warning: 'bi bi-exclamation-triangle-fill',
        info: 'bi bi-info-circle-fill'
      }
      return icons[type] || icons.info
    }
    
    return {
      notifications,
      removeNotification,
      getIcon
    }
  }
}
</script>

<style scoped>
.notifications-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

.notifications-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.notification {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  min-width: 300px;
  max-width: 400px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  pointer-events: auto;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.notification-success {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: white;
}

.notification-error {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
}

.notification-warning {
  background: linear-gradient(135deg, #f39c12, #e67e22);
  color: white;
}

.notification-info {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
}

.notification-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
}

.notification-message {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

.notification-close {
  background: none;
  border: none;
  color: inherit;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.notification-close:hover {
  opacity: 1;
}

.notification-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  animation: progress-shrink linear forwards;
}

@keyframes progress-shrink {
  from { width: 100%; }
  to { width: 0%; }
}

/* Animaciones de entrada/salida */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}

.notification-move {
  transition: transform 0.3s ease;
}

/* Dark mode adjustments */
.dark-mode .notification {
  border-color: rgba(255, 255, 255, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .notifications-container {
    top: 10px;
    right: 10px;
    left: 10px;
  }
  
  .notification {
    min-width: auto;
    max-width: none;
  }
}
</style> 