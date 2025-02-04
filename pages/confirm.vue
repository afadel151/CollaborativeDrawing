<script setup>
const user = useSupabaseUser()
const route = useRoute();
console.log(route.params.code); 
watch(user, () => {
  if (user.value) {

      return navigateTo('/dialog')
  }
}, { immediate: true })
</script>

<template>
    <div>Waiting for login...</div>
  </template>