import { io } from 'socket.io-client';

export default defineNuxtPlugin((nuxtApp) => {
  const socket = io('http://localhost:3000'); // Update with your server URL
  nuxtApp.provide('io', socket);
});
