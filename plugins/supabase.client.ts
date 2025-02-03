import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl as string
  const supabaseKey = config.public.supabaseKey as string

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL or Key is missing. Please check your environment variables.')
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true, // Enable session persistence
      autoRefreshToken: true, // Automatically refresh tokens
      detectSessionInUrl: true, // Detect session in URL
    }
  })

  return {
    provide: { supabaseClient: supabase },
  }
})
