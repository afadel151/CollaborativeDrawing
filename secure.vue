<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const checkSession = async () => {
  const { data, error } = await supabase.auth.getSession()
  console.log('Session Data:', data, 'Error:', error)
}

onMounted(checkSession)

const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.log(error)
  } else {
    // navigateTo('/login')
  }
}
</script>


<template>
    <div class="centre">
        <div class="space">secure page</div>
        <button type="button" @click="signOut">Log Out</button>
    </div>
</template>

<style scoped>
.centre {
    text-align: center;
    padding-top: 2rem;
    font-size: 30px;
}

.space {
    padding-top: 50px;
    padding-bottom: 50px;
}

button {
    border: none;
    font-size: 25px;
    background-color: rgb(39, 39, 39);
    color: white;
    padding: 15px 32px;
    border-radius: 12px;
    transition-duration: 0.4s;
}

button:hover {
    background-color: white;
    color: black;
    border: 1px solid black;
}
</style>