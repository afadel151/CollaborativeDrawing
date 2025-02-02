
export default defineNuxtPlugin(async () => {
  if (process.client) {
    const fabricModule = await import('fabric');
    return {
      provide: {
        fabric: fabricModule.fabric
      }
    };
  }
});
