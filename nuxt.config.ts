// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  pages: true,
  devtools: { enabled: true },
  supabase: {
    redirect: false
  },
  modules: ['@nuxtjs/tailwindcss','@nuxtjs/supabase','shadcn-nuxt' , '@nuxtjs/color-mode'],
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
  }
})
