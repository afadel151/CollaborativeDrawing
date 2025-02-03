<script setup>
import { useSupabaseClient, useSupabaseUser } from '#imports'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const checkAuth = async () => {
  const { data, error } = await supabase.auth.getSession()
  console.log('Session:', data)

  if (data.session) {
    console.log('User logged in:', data.session.user)
    navigateTo('/dialog')
  } else {
    console.log('No session found')
    navigateTo('/login')
  }
}

onMounted(checkAuth)
</script>

<template>
  <div>Waiting for login...</div>
</template>