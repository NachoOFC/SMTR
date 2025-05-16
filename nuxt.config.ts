// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  ssr: false,


  // Si usas GitHub Pages, descomenta esta línea y reemplaza "smtr" por el nombre de tu repo:
  // app: {
  //   baseURL: '/smtr/'
  // },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image'
  ]
})
