import { ref } from 'vue'

// Sistema de notificaciones global
let notifications = ref([])
let notificationId = 0

export const useNotifications = () => {
  const addNotification = (message, type = 'info', duration = 4000) => {
    const id = ++notificationId
    const notification = {
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
      duration,
      timestamp: Date.now()
    }
    
    notifications.value.push(notification)
    
    // Auto-remove after duration
    setTimeout(() => {
      removeNotification(id)
    }, duration)
    
    return id
  }
  
  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }
  
  const clearAll = () => {
    notifications.value = []
  }
  
  // Helpers para tipos específicos
  const success = (message, duration) => addNotification(message, 'success', duration)
  const error = (message, duration) => addNotification(message, 'error', duration)
  const warning = (message, duration) => addNotification(message, 'warning', duration)
  const info = (message, duration) => addNotification(message, 'info', duration)
  
  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info
  }
} 