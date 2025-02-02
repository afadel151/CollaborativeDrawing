// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/supabase', 'nuxt-socket-io'],
  // plugins: [ { src: '~/plugins/konvap', ssr: false } ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  io: {
    // module options
    sockets: [{
      name: 'main',
      url: 'http://localhost:3000'
    }]
  },
  
})