<script setup>
import { useSupabaseUser } from "#imports";
import { useRouter } from "vue-router";
const user = useSupabaseUser();
const router = useRouter();

onMounted(() => {
  if (user) {
    console.log('User is logged in, proceeding to dialog');
    router.push('/dialog');
  } else {
    console.log('User not logged in');
  }
});
</script>

<template>
    <div>Waiting for login...</div>
  </template>