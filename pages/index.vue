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
      <NuxtLink to="/login"
        class="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors">
        Start Drawing
      </NuxtLink>
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

<script setup>
onMounted(() => {
  if (process.client) {
    window.location.reload();
  }
});
</script>