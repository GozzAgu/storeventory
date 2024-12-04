import Aura from '@primevue/themes/aura';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap' },
      ]
    }
  },
  css: [
    '@/assets/css/tailwind.css', 
    'primeicons/primeicons.css',
  ],
  modules: ['@primevue/nuxt-module', '@nuxtjs/tailwindcss', '@pinia/nuxt'],
  plugins: [
    '~/plugins/primevue.js',
    '~/plugins/lightdarkmode.js',
    '~/plugins/firebaseConfig.js'
  ],
  primevue: {
    options: {
      theme: {
        preset: Aura
      }
    }
  }
})