<script setup>
import { useSupabaseClient, useSupabaseUser } from "#imports";
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

onMounted(() => {
  if (user.value) {
    console.log('User is logged in');
    if (router.currentRoute.value.path !== '/confirm') {
      router.push('/confirm');
    }
  } else {
    console.log('User is not logged in');
  }
});

const signInWithOAuth = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: '/confirm',
    },
  });
};
</script>


<template>
  <div class="max-w-7xl mx-auto relative flex flex-col justify-between items-center h-screen  px-4 sm:px-6 lg:px-8 py-40">
    <FallingStarsBg
      class="bg-white absolute -z-10 dark:bg-black"
      :color="isDark ? '#FFF' : '#555'"
    />
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-900 mb-8">
        Draw Together, Create Together
      </h1>
      <p class="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
        Join our creative community and collaborate in real-time with artists worldwide.
        Express yourself through digital art with our powerful drawing tools.
      </p>
      <Button variant="destructive"
        @click="signInWithOAuth"
        size='lg'
        class='mt-20'
      >
        <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.24 10.285V14.4h6.806c-.275 1.767-2.073 5.18-6.806 5.18-4.095 0-7.439-3.39-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.99 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
        </svg>
        Sign in with Google
      </Button>
    </div>

    <div class="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-white shadow-custom-purple-s p-6 rounded-xl ">
        <div class="text-indigo-600 text-4xl mb-4">🎨</div>
        <h3 class="text-xl font-semibold mb-2">Rich Drawing Tools</h3>
        <p class="text-gray-600">Multiple brushes, shapes, and colors at your disposal.</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-custom-purple-s">
        <div class="text-indigo-600 text-4xl mb-4">👥</div>
        <h3 class="text-xl font-semibold mb-2">Real-time Collaboration</h3>
        <p class="text-gray-600">Draw together with others in real-time.</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-custom-purple-s">
        <div class="text-indigo-600 text-4xl mb-4">💾</div>
        <h3 class="text-xl font-semibold mb-2">Auto-saving</h3>
        <p class="text-gray-600">Your artwork is automatically saved as you draw.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-with-google-btn {
  transition: background-color .3s, box-shadow .3s;
  padding: 12px 16px 12px 42px;
  border: none;
  border-radius: 3px;
  box-shadow: 0 -1px 0 rgba(0, 0, 0, .04), 0 1px 1px rgba(0, 0, 0, .25);
  color: #757575;
  font-size: 14px;
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=);
  background-color: white;
  background-repeat: no-repeat;
  background-position: 12px 11px;
}
</style>
