<template>
    <div class="h-screen flex justify-between">
      <!-- Left Sidebar (Collaborating Users) -->
      <div class="w-1/6 bg-gray-800 text-white p-4 flex flex-col items-center">
        <h2 class="text-xl font-semibold mb-6">Collaborators</h2>
        <div class="space-y-4 w-full">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full bg-green-500"></div>
            <p class="text-sm">User 1</p>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full bg-red-500"></div>
            <p class="text-sm">User 2</p>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full bg-blue-500"></div>
            <p class="text-sm">User 3</p>
          </div>
          <!-- Add more users here -->
        </div>
      </div>
  
      <!-- Main Canvas Area -->
      <div class="w-2/3 flex justify-center items-center bg-gray-100">
        <div class="relative w-full h-full p-20">
          <canvas ref="canvasRef" id="canvas"  class="border-2 w-full h-full border-gray-300 bg-white"></canvas>
        </div>
      </div>
  
      <!-- Right Sidebar (Drawing Tools) -->
      <div class="w-1/6 bg-white p-6 border-l-2 border-gray-300">
        <h2 class="text-xl font-semibold mb-4">Drawing Tools</h2>
        
        <label for="drawing-mode-selector" class="block mb-4">
          <p class="text-sm mb-1">Mode:</p>
          <select id="drawing-mode-selector" class="w-full px-3 py-2 border rounded-md bg-gray-100">
            <option value="pencil">Pencil</option>
            <option value="circle">Circle</option>
            <option value="spray">Spray</option>
            <option value="pattern">Pattern</option>
            <option value="hline">Horizontal Line</option>
            <option value="vline">Vertical Line</option>
            <option value="square">Square</option>
            <option value="diamond">Diamond</option>
          </select>
        </label>
  
        <label for="drawing-line-width" class="block mb-4">
          <p class="text-sm mb-1">Line Width:</p>
          <input type="range" min="0" max="150" id="drawing-line-width" class="w-full px-3 py-2 border rounded-md bg-gray-100" />
        </label>
  
        <label for="drawing-color" class="block mb-4">
          <p class="text-sm mb-1">Line Color:</p>
          <input type="color" id="drawing-color" class="w-full border rounded-md bg-gray-100" />
        </label>
  
        <label for="drawing-shadow-color" class="block mb-4">
          <p class="text-sm mb-1">Shadow Color:</p>
          <input type="color" id="drawing-shadow-color" class="w-full border rounded-md bg-gray-100" />
        </label>
  
        <label for="drawing-shadow-width" class="block mb-4">
          <p class="text-sm mb-1">Shadow Width:</p>
          <input type="range" min="0" max="50" id="drawing-shadow-width" class="w-full px-3 py-2 border rounded-md bg-gray-100" />
        </label>
  
        <label for="drawing-shadow-offset" class="block mb-4">
          <p class="text-sm mb-1">Shadow Offset:</p>
          <input type="range" min="0" max="50" id="drawing-shadow-offset" class="w-full px-3 py-2 border rounded-md bg-gray-100" />
        </label>
  
        <button id="clear-canvas" class="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">Clear Canvas</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
  import * as fabric from 'fabric';
  
  const canvasRef = ref(null); // Reference to the canvas
  
  const initializeCanvas = () => {
    if (canvas) return; // Only initialize the canvas if it's not already initialized
    
    // Initialize a new fabric canvas instance
    canvas = new fabric.Canvas(canvasRef.value, {
      isDrawingMode: true,
    });
  
    // Default drawing brush
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    fabric.Object.prototype.transparentCorners = false;
  
    const $ = (id) => document.getElementById(id);
    const drawingModeEl = $('drawing-mode');
    const drawingColorEl = $('drawing-color');
    const drawingLineWidthEl = $('drawing-line-width');
    const drawingShadowColorEl = $('drawing-shadow-color');
    const drawingShadowWidth = $('drawing-shadow-width');
    const drawingShadowOffset = $('drawing-shadow-offset');
    const clearEl = $('clear-canvas');
    const drawingModeSelector = $('drawing-mode-selector');
  
    // Clear canvas button
    clearEl.onclick = function () {
      canvas.clear();
    };
  
    // Toggle drawing mode
    drawingModeEl.onclick = function () {
      canvas.isDrawingMode = !canvas.isDrawingMode;
      drawingModeEl.innerHTML = canvas.isDrawingMode
        ? 'Cancel drawing mode'
        : 'Enter drawing mode';
    };
  
    // Change brush color
    drawingColorEl.onchange = function () {
      canvas.freeDrawingBrush.color = this.value;
    };
  
    // Change shadow color
    drawingShadowColorEl.onchange = function () {
      canvas.freeDrawingBrush.shadow.color = this.value;
    };
  
    // Change brush width
    drawingLineWidthEl.onchange = function () {
      canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
    };
  
    // Change shadow width
    drawingShadowWidth.onchange = function () {
      canvas.freeDrawingBrush.shadow.blur = parseInt(this.value, 10) || 0;
    };
  
    // Change shadow offset
    drawingShadowOffset.onchange = function () {
      canvas.freeDrawingBrush.shadow.offsetX = parseInt(this.value, 10) || 0;
      canvas.freeDrawingBrush.shadow.offsetY = parseInt(this.value, 10) || 0;
    };
  
    // Change drawing mode (pencil, circle, spray, etc.)
    drawingModeSelector.onchange = function () {
      const mode = this.value;
      switch (mode) {
        case 'pencil':
          canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
          break;
        case 'circle':
          canvas.freeDrawingBrush = new fabric.CircleBrush(canvas);
          break;
        case 'spray':
          canvas.freeDrawingBrush = new fabric.SprayBrush(canvas);
          break;
        case 'pattern':
          canvas.freeDrawingBrush = new fabric.PatternBrush(canvas);
          break;
        case 'hline':
          canvas.freeDrawingBrush = new fabric.LineBrush(canvas, {
            isDrawingMode: true,
          });
          break;
        case 'vline':
          canvas.freeDrawingBrush = new fabric.LineBrush(canvas, {
            isDrawingMode: true,
            angle: 90,
          });
          break;
        case 'square':
          canvas.freeDrawingBrush = new fabric.SquareBrush(canvas);
          break;
        case 'diamond':
          canvas.freeDrawingBrush = new fabric.DiamondBrush(canvas);
          break;
        default:
          canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      }
    };
  };
  
  // Cleanup the canvas instance when the component is destroyed or re-rendered
  onBeforeUnmount(() => {
    if (canvas) {
      canvas.dispose();
      console.log('disposed');
      canvas = null; // Ensure the canvas instance is cleared
    }
  });
  
  // Initialize canvas when mounted
  onMounted(() => {
    initializeCanvas(); // Initialize the canvas on mount
  });
  
  // Watch for changes in the canvas reference to ensure re-initialization doesn't occur
  watch(canvasRef, (newRef) => {
    if (newRef && !canvas) {
      initializeCanvas();
    }
  });
  </script>
  
  <style scoped>
  /* Add any custom styling if needed */
  </style>
  