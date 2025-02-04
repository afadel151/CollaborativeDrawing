<script setup>
import { PenLine, Users } from "lucide-vue-next";
import { useSupabaseClient, useSupabaseUser } from "#imports";
const supabase = useSupabaseClient();
const router = useRouter()
const user = useSupabaseUser();
watchEffect(() => {
  if (!user.value) {
    console.log("No session found, redirecting to /login");
    navigateTo("/login");
  }
});
import { nanoid } from 'nanoid'
// const router = useRouter();
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
