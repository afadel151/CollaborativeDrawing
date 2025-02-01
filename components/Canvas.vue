<template>
    <div>
        <canvas ref="canvas"></canvas>
        <input type="color" v-model="color" />
        <button @click="currentTool = 'pencil'">Pencil</button>
        <button @click="currentTool = 'rect'">Rectangle</button>
        <button @click="currentTool = 'circle'">Circle</button>
        <button @click="currentTool = 'triangle'">Triangle</button>
        <button @click="undo">Undo</button>
        <button @click="redo">Redo</button>
        <select v-model="imageFormat">
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
        </select>
        <input type="range" v-model="imageQuality" min="0.1" max="1.0" step="0.1" />
        <button @click="downloadImage">Download Image</button>
    </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';

const { $io } = useNuxtApp();

const canvasRef = ref(null);
const canvas = ref(null);
const currentTool = ref('pencil');
const color = ref('#000000');
const isDrawing = ref(false);
const startPoint = ref(null);
const tempId = ref(null);
const history = ref([]);
const historyIndex = ref(-1);
const imageFormat = ref('png');
const imageQuality = ref(1.0);
import { Canvas } from 'fabric';
onMounted( () => { // Prevent execution on the server

 
        // Dynamically import fabric.js

        // Initialize the Fabric.js canvas
        canvas.value = new Canvas(canvasRef.value, {
            width: 1000,
            height: 1000,
            isDrawingMode: false,
        });

        // Load initial drawing history
        $io.on('init', (historyData) => {
            historyData.forEach((data) => addObject(data));
        });

        // Handle real-time drawing updates
        $io.on('drawing', (data) => {
            if (data.isTemp) {
                updateTempDrawing(data);
            } else {
                addObject(data);
            }
        });

        // Set up event handlers
        setupEventHandlers();
  
});

// Event handlers for drawing
const setupEventHandlers = () => {
    canvas.value.on('mouse:down', (e) => startDrawing(e));
    canvas.value.on('mouse:move', (e) => draw(e));
    canvas.value.on('mouse:up', () => stopDrawing());
};

// Start drawing
const startDrawing = (e) => {
    if (currentTool.value === 'pencil') {
        canvas.value.isDrawingMode = true;
        canvas.value.freeDrawingBrush.color = color.value;
        canvas.value.freeDrawingBrush.width = 2;
        return;
    }
    isDrawing.value = true;
    startPoint.value = canvas.value.getPointer(e.e);
    tempId.value = Date.now().toString();
};


// Draw on canvas
const draw = (e) => {
    if (!isDrawing.value || !startPoint.value) return;
    const currentPoint = canvas.value.getPointer(e.e);

    const data = {
        tool: currentTool.value,
        start: startPoint.value,
        end: currentPoint,
        color: color.value,
        tempId: tempId.value,
        isTemp: true,
    };

    $io.emit('drawing', data);
};

// Stop drawing
const stopDrawing = (e) => {
    isDrawing.value = false;
    if (!startPoint.value) return;

    const data = {
        tool: currentTool.value,
        start: startPoint.value,
        end: canvas.value.getPointer(e.e), // Make sure `e` exists
        color: color.value,
        tempId: tempId.value,
        isTemp: false,
    };

    $io.emit('drawing', data);
};


// Update temporary drawings
const updateTempDrawing = (data) => {
    const obj = canvas.value.getObjects().find((o) => o.tempId === data.tempId);
    if (obj) canvas.value.remove(obj);

    const newObj = createShape(data);
    newObj.tempId = data.tempId;
    canvas.value.add(newObj);
    canvas.value.renderAll();
};

// Add permanent objects to canvas
const addObject = (data) => {
    const obj = createShape(data);
    canvas.value.add(obj);
    history.value = history.value.slice(0, historyIndex.value + 1); // Clear redo stack
    history.value.push(obj);
    historyIndex.value++;
};

// Create shapes based on tool
const createShape = (data) => {
    let obj;
    switch (data.tool) {
        case 'pencil':
            obj = new fabric.Line([data.start.x, data.start.y, data.end.x, data.end.y], {
                stroke: data.color,
                strokeWidth: 2,
            });
            break;
        case 'rect':
            obj = new fabric.Rect({
                left: data.start.x,
                top: data.start.y,
                width: data.end.x - data.start.x,
                height: data.end.y - data.start.y,
                stroke: data.color,
                fill: 'transparent',
            });
            break;
        case 'circle':
            const radius = Math.sqrt(
                Math.pow(data.end.x - data.start.x, 2) + Math.pow(data.end.y - data.start.y, 2)
            );
            obj = new fabric.Circle({
                left: data.start.x,
                top: data.start.y,
                radius: radius,
                stroke: data.color,
                fill: 'transparent',
            });
            break;
        case 'triangle':
            obj = new fabric.Triangle({
                left: data.start.x,
                top: data.start.y,
                width: data.end.x - data.start.x,
                height: data.end.y - data.start.y,
                stroke: data.color,
                fill: 'transparent',
            });
            break;
    }
    return obj;
};

// Undo last action
const undo = () => {
    if (historyIndex.value < 0) return;
    const obj = history.value[historyIndex.value];
    canvas.value.remove(obj);
    historyIndex.value--;
};

// Redo last undone action
const redo = () => {
    if (historyIndex.value < history.value.length - 1) {
        historyIndex.value++;
        const obj = history.value[historyIndex.value];
        canvas.value.add(obj);
    }
};

// Download canvas as image
const downloadImage = () => {
    const dataURL = canvas.value.toDataURL({
        format: imageFormat.value,
        quality: imageFormat.value === 'jpeg' ? imageQuality.value : 1.0,
    });
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `drawing.${imageFormat.value}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
</script>

<style scoped>
canvas {
    border: 1px solid #000;
}
</style>