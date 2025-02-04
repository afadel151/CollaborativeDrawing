<script setup>
const user = useSupabaseUser()
onMounted(()=>{
  if (user) {
    return navigateTo('/dialog')
  }
})
watch(user, () => {
  if (user.value) {
      return navigateTo('/dialog')
  }
}, { immediate: true })
</script>

<template>
    <div>Waiting for login...</div>
  </template>