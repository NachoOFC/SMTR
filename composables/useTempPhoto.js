import { ref } from 'vue'

// Variable global para mantener la foto durante toda la sesión
let globalTempPhotoURL = null

// Composable para manejar la foto temporal de perfil
export const useTempPhoto = () => {
  // Crear la variable reactiva solo una vez
  if (!globalTempPhotoURL) {
    globalTempPhotoURL = ref('')
  }

  const tempPhotoURL = globalTempPhotoURL

  const setTempPhoto = (photoURL) => {
    tempPhotoURL.value = photoURL
  }

  const clearTempPhoto = () => {
    tempPhotoURL.value = ''
  }

  const getTempPhoto = () => {
    return tempPhotoURL.value
  }

  return {
    tempPhotoURL,
    setTempPhoto,
    clearTempPhoto,
    getTempPhoto
  }
} 