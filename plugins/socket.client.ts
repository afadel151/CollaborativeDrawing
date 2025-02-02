import { io } from 'socket.io-client';

export default defineNuxtPlugin((nuxtApp) => {
  const socket = io('https://collaborativedrawing.onrender.com'); // Update with your server URL
  nuxtApp.provide('io', socket);
});
