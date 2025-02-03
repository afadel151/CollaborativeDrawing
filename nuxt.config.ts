// https://nuxt.com/docs/api/configuration/nuxt-config


export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
  },
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  modules: ['@nuxtjs/supabase','@nuxtjs/tailwindcss','@nuxtjs/color-mode', 'nuxt-socket-io','shadcn-nuxt'],

  
  io: {
    // module options
    sockets: [{
      name: 'main',
      url: 'https://collaborativedrawing.onrender.com'
    }]
  },
  
  plugins: ['~/plugins/supabase.client.ts'],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})