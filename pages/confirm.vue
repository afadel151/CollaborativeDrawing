<script setup>
import { useSupabaseUser } from "#imports";
import { useRouter } from "vue-router";
const user = useSupabaseUser();
const router = useRouter();

onMounted(() => {
  if (user.value) {
    console.log('User is logged in, proceeding to dialog');
    router.push('/dialog')
  } else {
    console.log('User not logged in');
    router.push('/login')
  }
});
</script>

<template>
    <div>Waiting for login...</div>
  </template>