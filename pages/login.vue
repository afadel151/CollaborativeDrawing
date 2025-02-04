<!-- <script setup>
import { useSupabaseClient, useSupabaseUser } from "#imports";
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

onMounted(() => {
  if (user) {
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
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center">
      <h1 class="text-5xl font-bold text-gray-900 mb-8">
        Draw Together, Create Together
      </h1>
      <p class="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
        Join our creative community and collaborate in real-time with artists worldwide.
        Express yourself through digital art with our powerful drawing tools.
      </p>
      <button
        @click="signInWithOAuth"
        class="inline-flex items-center justify-center bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors"
      >
        <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.24 10.285V14.4h6.806c-.275 1.767-2.073 5.18-6.806 5.18-4.095 0-7.439-3.39-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.99 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
        </svg>
        Sign in with Google
      </button>
    </div>

    <div class="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-white p-6 rounded-xl shadow-md">
        <div class="text-indigo-600 text-4xl mb-4">🎨</div>
        <h3 class="text-xl font-semibold mb-2">Rich Drawing Tools</h3>
        <p class="text-gray-600">Multiple brushes, shapes, and colors at your disposal.</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md">
        <div class="text-indigo-600 text-4xl mb-4">👥</div>
        <h3 class="text-xl font-semibold mb-2">Real-time Collaboration</h3>
        <p class="text-gray-600">Draw together with others in real-time.</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md">
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
</style> -->


<script setup>
console.log('User is logged');
import { PenLine, Users } from "lucide-vue-next";
const supabase = useSupabaseClient();
const router = useRouter()
const user = useSupabaseUser();
// onMounted(() => {
//   if (user) {
//     console.log('User is logged');
    
//     // navigateTo("/login");
//   }
// });
import { nanoid } from 'nanoid'
const joinCode = ref("");
const isJoinDialogOpen = ref(false);

const createNewDrawing = async () => {
  const drawingCode = nanoid(10);
  try {
    const { error } = await supabase
      .from('drawings')
      .insert({
        code: drawingCode,
        user_id: user.value.id,
      });
    if (error) {
      console.error('Insert error:', error.message);
    } else {
      console.log('Record inserted successfully');
        router.push(`/draw/${drawingCode}`)
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
};
import Button from "~/components/ui/button/Button.vue";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import Input from "~/components/ui/input/Input.vue";

const joinDrawing = async () => {
      if (!joinCode.value) return
      const { data, error } = await supabase
        .from('drawings')
        .select('code')
        .eq('code', joinCode.value)
        .single()
      if (data) {
        router.push(`/draw/${joinCode.value}`)
      } else {
        console.error('Invalid drawing code')
      }
};
</script>

<template>
 
  <div
    class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full space-y-8"
    >
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Start Drawing
        </h1>
        <p class="text-gray-500 dark:text-gray-400">
          Create a new drawing or join an existing one
        </p>
      </div>

      <div class="grid grid-cols-1 gap-4">
        <Button
          @click="createNewDrawing"
          class="h-20 text-lg"
          variant="outline"
        >
          <PenLine class="mr-2 h-6 w-6" />
          Create New Drawing
        </Button>

        <Dialog v-model:open="isJoinDialogOpen">
          <DialogTrigger as-child>
            <Button class="h-20 text-lg" variant="outline">
              <Users class="mr-2 h-6 w-6" />
              Join Existing Drawing
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Join Drawing Session</DialogTitle>
            </DialogHeader>
            <div class="space-y-4 pt-4">
              <Input v-model="joinCode" placeholder="Enter drawing code" />
              <Button class="w-full" @click="joinDrawing"> Join Drawing </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  </div>
</template> 