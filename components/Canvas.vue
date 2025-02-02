<script setup>
import { io } from 'socket.io-client'
import * as fabric from 'fabric';
const socket = io('https://collaborativedrawing.onrender.com');
const lineWidth= ref(5)
const shadowWidth= ref(5)
const shadowOffset= ref(5)
const shadowColor= ref(null)
onMounted(() => {
  const $ = (id) => document.getElementById(id);

  const canvas = new fabric.Canvas(document.getElementById('c'), {
    isDrawingMode: true,
  });

  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);

  fabric.Object.prototype.transparentCorners = false;

  var drawingModeEl = $('drawing-mode'),
    drawingOptionsEl = $('drawing-mode-options'),
    drawingColorEl = $('drawing-color'),
    drawingShadowColorEl = $('drawing-shadow-color'),
    drawingLineWidthEl = $('drawing-line-width'),
    drawingShadowWidth = $('drawing-shadow-width'),
    drawingShadowOffset = $('drawing-shadow-offset'),
    clearEl = $('clear-canvas');

  clearEl.onclick = function () {
    canvas.clear();
    socket.emit('clear');
  };

  drawingModeEl.onclick = function () {
    canvas.isDrawingMode = !canvas.isDrawingMode;
    if (canvas.isDrawingMode) {
      drawingModeEl.innerHTML = 'Cancel drawing mode';
    } else {
      drawingModeEl.innerHTML = 'Enter drawing mode';
    }
  };

  if (fabric.PatternBrush) {
    var vLinePatternBrush = new fabric.PatternBrush(canvas);
    vLinePatternBrush.getPatternSrc = function () {
      var patternCanvas = fabric.getEnv().document.createElement('canvas');
      patternCanvas.width = patternCanvas.height = 10;
      var ctx = patternCanvas.getContext('2d');

      ctx.strokeStyle = this.color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, 5);
      ctx.lineTo(10, 5);
      ctx.closePath();
      ctx.stroke();

      return patternCanvas;
    };

    var hLinePatternBrush = new fabric.PatternBrush(canvas);
    hLinePatternBrush.getPatternSrc = function () {
      var patternCanvas = fabric.getEnv().document.createElement('canvas');
      patternCanvas.width = patternCanvas.height = 10;
      var ctx = patternCanvas.getContext('2d');

      ctx.strokeStyle = this.color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(5, 0);
      ctx.lineTo(5, 10);
      ctx.closePath();
      ctx.stroke();

      return patternCanvas;
    };

    var squarePatternBrush = new fabric.PatternBrush(canvas);
    squarePatternBrush.getPatternSrc = function () {
      var squareWidth = 10,
        squareDistance = 2;

      var patternCanvas = fabric.getEnv().document.createElement('canvas');
      patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
      var ctx = patternCanvas.getContext('2d');

      ctx.fillStyle = this.color;
      ctx.fillRect(0, 0, squareWidth, squareWidth);

      return patternCanvas;
    };

    var diamondPatternBrush = new fabric.PatternBrush(canvas);
    diamondPatternBrush.getPatternSrc = function () {
      var squareWidth = 10,
        squareDistance = 5;
      var patternCanvas = fabric.getEnv().document.createElement('canvas');
      var rect = new fabric.Rect({
        width: squareWidth,
        height: squareWidth,
        angle: 45,
        fill: this.color,
      });

      var canvasWidth = rect.getBoundingRect().width;

      patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
      rect.set({
        left: canvasWidth / 2,
        top: canvasWidth / 2,
      });

      var ctx = patternCanvas.getContext('2d');
      rect.render(ctx);

      return patternCanvas;
    };

    var img = new Image();
    img.src = '../../assets/ladybug.png';

    var texturePatternBrush = new fabric.PatternBrush(canvas);
    texturePatternBrush.source = img;
  }

  $('drawing-mode-selector').onchange = function () {
    if (this.value === 'hline') {
      canvas.freeDrawingBrush = vLinePatternBrush;
    } else if (this.value === 'vline') {
      canvas.freeDrawingBrush = hLinePatternBrush;
    } else if (this.value === 'square') {
      canvas.freeDrawingBrush = squarePatternBrush;
    } else if (this.value === 'diamond') {
      canvas.freeDrawingBrush = diamondPatternBrush;
    } else if (this.value === 'texture') {
      canvas.freeDrawingBrush = texturePatternBrush;
    } else {
      canvas.freeDrawingBrush = new fabric[this.value + 'Brush'](canvas);
    }

    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = drawingColorEl.value;
      canvas.freeDrawingBrush.width =
        parseInt(drawingLineWidthEl.value, 10) || 1;
      canvas.freeDrawingBrush.shadow = new fabric.Shadow({
        blur: parseInt(drawingShadowWidth.value, 10) || 0,
        offsetX: 0,
        offsetY: 0,
        affectStroke: true,
        color: drawingShadowColorEl.value,
      });
    }
  };

  drawingColorEl.onchange = function () {
    canvas.freeDrawingBrush.color = this.value;
  };
  drawingShadowColorEl.onchange = function () {
    canvas.freeDrawingBrush.shadow.color = this.value;
  };
  drawingLineWidthEl.onchange = function () {
    canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
    this.previousSibling.querySelector('span').innerHTML = this.value;
  };
  drawingShadowWidth.onchange = function () {
    canvas.freeDrawingBrush.shadow.blur = parseInt(this.value, 10) || 0;
    this.previousSibling.querySelector('span').innerHTML = this.value;
  };
  drawingShadowOffset.onchange = function () {
    canvas.freeDrawingBrush.shadow.offsetX = parseInt(this.value, 10) || 0;
    canvas.freeDrawingBrush.shadow.offsetY = parseInt(this.value, 10) || 0;
    this.previousSibling.querySelector('span').innerHTML = this.value;
  };

  if (canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush.color = drawingColorEl.value;
    canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
    canvas.freeDrawingBrush.shadow = new fabric.Shadow({
      blur: parseInt(drawingShadowWidth.value, 10) || 0,
      offsetX: 0,
      offsetY: 0,
      affectStroke: true,
      color: drawingShadowColorEl.value,
    });
  } 
  socket.on('draw', (data) => {
    if (data.type === 'path') {
      canvas.add(new fabric.Path(data.path, data.options));
    } else if (data.type === 'clear') {
      canvas.clear();
    }
  });
  canvas.on('path:created', (event) => {
    const path = event.path;
    socket.emit('draw', {
      type: 'path',
      path: path.path,
      options: path.toObject(),
    });
  });
  
})

</script>

<template>
  <div class="flex h-screen">
        <!-- Left Sidebar -->
        <div class="w-1/5 bg-white p-4 shadow-md">
            <h2 class="text-xl font-semibold mb-4">Invited Users</h2>
            <ul>
                <li class="mb-2">User 1</li>
                <li class="mb-2">User 2</li>
                <li class="mb-2">User 3</li>
            </ul>
        </div>
        <!-- Main Content -->
        <div class="flex-grow flex items-center justify-center">
            <canvas id="c" width="500" height="500" class="border"></canvas>
        </div>
        <!-- Right Sidebar -->
        <div class="w-1/5 bg-white p-4 shadow-md">
            <h2 class="text-xl font-semibold mb-4">Tools</h2>
            <div id="drawing-mode-options">
                <button id="drawing-mode" class="btn btn-info mb-2">Cancel drawing mode</button>
                <button id="clear-canvas" class="btn btn-info mb-4">Clear</button>
                <div class="mb-4">
                    <label for="drawing-mode-selector" class="block mb-2">Mode:</label>
                    <select id="drawing-mode-selector" class="w-full p-2 border">
                        <option>Pencil</option>
                        <option>Circle</option>
                        <option>Spray</option>
                        <option>Pattern</option>
                        <option>hline</option>
                        <option>vline</option>
                        <option>square</option>
                        <option>diamond</option>
                        <option>texture</option>
                    </select>
                </div>
                <div class="mb-4">
                    <label for="drawing-line-width" class="block mb-2">Line width:</label>
                    <span class="info block mb-2">{{lineWidth}}</span>
                    <input v-model="lineWidth" type="range" min="0" max="150" id="drawing-line-width" class="w-full" />
                </div>
                <div class="mb-4 flex justify-between pr-10">
                    <label for="drawing-color" class="block mb-2">Line color:</label>
                    <input type="color" id="drawing-color" class="w-20  border" />
                </div>
                <div class="mb-4 flex justify-between pr-10">
                    <label for="drawing-shadow-color" class="block mb-2">Shadow color:</label>
                    <input type="color" v-model="shadowColor" id="drawing-shadow-color" class="w-20 border" />
                </div>
                <div class="mb-4">
                    <label for="drawing-shadow-width" class="block mb-2">Shadow width:</label>
                    <span class="info block mb-2">{{shadowWidth}}</span>
                    <input type="range" v-model="shadowWidth" min="0" max="50" id="drawing-shadow-width" class="w-full" />
                </div>
                <div class="mb-4">
                    <label for="drawing-shadow-offset" class="block mb-2">Shadow offset:</label>
                    <span class="info block mb-2">{{ shadowOffset }}</span>
                    <input type="range" min="0" v-model="shadowOffset" max="50" id="drawing-shadow-offset" class="w-full" />
                </div>
            </div>
        </div>
      </div>
</template>