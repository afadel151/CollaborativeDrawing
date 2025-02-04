<script setup>
const user = useSupabaseUser()

watch(user, () => {
  if (user.value) {

      return navigateTo('/dialog')
  }
}, { immediate: true })
</script>

<template>
    <div>Waiting for login...</div>
  </template>