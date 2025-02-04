<script setup>

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { io } from 'socket.io-client'
import * as fabric from 'fabric';
const socket = io('https://collaborativedrawing.onrender.com');
const lineWidth = ref(5)
const shadowWidth = ref(5)
const shadowOffset = ref(5)
const shadowColor = ref(null)
const route = useRoute()
const roomCode = route.params.code
const selectedMode = ref('Pencil')
let canvas;
onMounted(() => {

    const $ = (id) => document.getElementById(id);
    socket.emit('join-room', roomCode);
    canvas = new fabric.Canvas(document.getElementById('c'), {
        isDrawingMode: true,
    });
    const width = window.innerWidth * 0.5;  // 80% of viewport width
    const height = window.innerHeight * 0.7; // 80% of viewport height

    canvas.setWidth(width);
    canvas.setHeight(height);
    const canvasElement = document.getElementById("c");
    canvasElement.style.width = `${width}px`;
    canvasElement.style.height = `${height}px`;
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);

    fabric.Object.prototype.transparentCorners = false;
    canvas.on('object:moving', (event) => {
        const object = event.target;
        socket.emit('draw', {
            roomCode,
            type: 'move',
            object: object.toObject(), // Send object properties (position, etc.)
        });
    });
    canvas.on('object:rotating', (event) => {
        const object = event.target;
        socket.emit('draw', {
            roomCode,
            type: 'rotate',
            object: object.toObject(), // Send object properties (rotation, etc.)
        });
    });
    canvas.on('object:scaling', (event) => {
        const object = event.target;
        socket.emit('draw', {
            roomCode,
            type: 'scale',
            object: object.toObject(), // Send object properties (scale, etc.)
        });
    });
    var drawingModeEl = $('drawing-mode'),
        drawingOptionsEl = $('drawing-mode-options'),
        drawingColorEl = $('drawing-color'),
        drawingShadowColorEl = $('drawing-shadow-color'),
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

    watch(selectedMode, (newMode) => {
        if (newMode === 'hline') {
            canvas.freeDrawingBrush = vLinePatternBrush;
        } else if (newMode === 'vline') {
            canvas.freeDrawingBrush = hLinePatternBrush;
        } else if (newMode === 'square') {
            canvas.freeDrawingBrush = squarePatternBrush;
        } else if (newMode === 'diamond') {
            canvas.freeDrawingBrush = diamondPatternBrush;
        } else if (newMode === 'texture') {
            canvas.freeDrawingBrush = texturePatternBrush;
        } else {
            canvas.freeDrawingBrush = new fabric[newMode + 'Brush'](canvas);
        }

        if (canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush.color = drawingColorEl.value;
            canvas.freeDrawingBrush.width = parseInt(lineWidth.value, 10) || 1;
            canvas.freeDrawingBrush.shadow = new fabric.Shadow({
                blur: parseInt(drawingShadowWidth.value, 10) || 0,
                offsetX: 0,
                offsetY: 0,
                affectStroke: true,
                color: drawingShadowColorEl.value,
            });
        }
    });

    drawingColorEl.onchange = function () {
        canvas.freeDrawingBrush.color = this.value;
    };
    drawingShadowColorEl.onchange = function () {
        canvas.freeDrawingBrush.shadow.color = this.value;
    };
    watch(lineWidth, (newWidth) => {
        console.log('Line width changed:', newWidth);
        if (canvas && canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush.width = newWidth;
        }
    });
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
        canvas.freeDrawingBrush.width = parseInt(lineWidth.value, 10) || 1;
        canvas.freeDrawingBrush.shadow = new fabric.Shadow({
            blur: parseInt(drawingShadowWidth.value, 10) || 0,
            offsetX: 0,
            offsetY: 0,
            affectStroke: true,
            color: drawingShadowColorEl.value,
        });
    }
    socket.on('draw', (data) => {
        if (data.roomCode === roomCode) {
            if (data.type === 'add') {
                const existingObject = canvas.getObjects().find(o => o.id === data.object.id);
                if (!existingObject) {
                    fabric.util.enlivenObjects([data.object], function (objects) {
                        objects.forEach(obj => {
                            obj.set({ id: data.object.id });
                            canvas.add(obj);
                        });
                        canvas.renderAll();
                    });
                }
            }
            if (data.type === 'path') {
                canvas.add(new fabric.Path(data.path, data.options));
            } else if (data.type === 'clear') {
                canvas.clear();
            }
            if (data.type === 'move' || data.type === 'rotate' || data.type === 'scale') {
                const { object } = data;
                const fabricObject = canvas.getObjects().find(o => o.id === object.id); // Find object by ID
                if (fabricObject) {
                    fabricObject.set(object); // Update the object with the new properties
                    canvas.renderAll();
                }

            }

        }
    });
    canvas.on('path:created', (event) => {
        const path = event.path;
        socket.emit('draw', {
            roomCode,
            type: 'path',
            path: path.path,
            options: path.toObject(),
        });
    });



})
const LineColor = ref('#000000')
onBeforeUnmount(() => {
    socket.emit('leave-room', roomCode); // Optionally handle leaving the room on the server
    socket.disconnect();
});
const addShape = (type) => {
    let shape;

    switch (type) {
        case 'circle':
            shape = new fabric.Circle({
                left: 100,
                top: 100,
                radius: 50,
                fill: 'blue',
                id: `circle-${Date.now()}`, // Ensure ID is set
            });
            break;
        case 'rectangle':
            shape = new fabric.Rect({
                left: 150,
                top: 150,
                width: 100,
                height: 60,
                fill: 'red',
                id: `rectangle-${Date.now()}`, // Ensure ID is set
            });
            break;
        case 'triangle':
            shape = new fabric.Triangle({
                left: 200,
                top: 200,
                width: 80,
                height: 80,
                fill: 'green',
                id: `triangle-${Date.now()}`, // Ensure ID is set
            });
            break;
        case 'line':
            shape = new fabric.Line([50, 50, 200, 200], {
                stroke: 'black',
                strokeWidth: 5,
                id: `line-${Date.now()}`, // Ensure ID is set
            });
            break;
    }

    if (shape) {
        canvas.add(shape);
        socket.emit('draw', {
            roomCode,
            type: 'add',
            object: shape.toObject(['id']), // Include 'id' in the serialized object
        });
    }
};
</script>

<template>
    <div class="flex md:p-0 p-10 flex-col-reverse md:flex-row min-h-screen">
        <!-- Left Sidebar -->
        <div class="w-1/6 md:block hidden bg-white p-4 shadow-md">
            <h2 class="text-xl font-semibold mb-4">Invited Users</h2>
            <ul>
                <li class="mb-2">User 1</li>
                <li class="mb-2">User 2</li>
                <li class="mb-2">User 3</li>
            </ul>
        </div>
        <!-- Main Content -->
        <div class="flex-grow flex items-center justify-center  h-screen">
            <canvas id="c"   class="border " ></canvas>
        </div>
        <!-- Right Sidebar -->
        <div class="md:w-1/5 bg-white pt-10 p-4 shadow-md">
            <h2 class="text-4xl text-center font-semibold mb-4">Tools</h2>
            <div id="drawing-mode-options" class="px-10">
                <Button id="drawing-mode" class="w-full">Cancel drawing mode</Button>
                <Button variant="outline" class="w-full mt-2" id="clear-canvas">Clear</Button>
                <div class="mb-4 flex flex-col mt-4 justify-center items-center">
                    <label for="drawing-mode-selector" class="block mb-2 text-xl font-bold">Mode</label>
                    <Select id="drawing-mode-selector" v-model="selectedMode" class="w-full p-2 border">
                        <SelectTrigger class="w-full">
                            <SelectValue class="text-lg" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Mode</SelectLabel>
                                <SelectItem value="Pencil">Pencil</SelectItem>
                                <SelectItem value="Circle">Circle</SelectItem>
                                <SelectItem value="Spray">Spray</SelectItem>
                                <SelectItem value="Pattern">Pattern</SelectItem>
                                <SelectItem value="hline">Horizontal Line</SelectItem>
                                <SelectItem value="vline">Vertical Line</SelectItem>
                                <SelectItem value="square">Square</SelectItem>
                                <SelectItem value="diamond">Diamond</SelectItem>
                                <SelectItem value="texture">Texture</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div class="mb-4 flex flex-col justify-center items-center">
                    <label for="drawing-line-width" class="block mb-2 text-xl font-bold">Line width</label>
                    <input v-model="lineWidth" type="range" id="drawing-line-width" class="w-full range" min="0"
                        max="100" />
                </div>
                <div class="mb-4 flex justify-between items-center pr-10">
                    <label for="drawing-color" class="block mb-2 text-xl font-bold">Line color</label>
                    <input v-model="LineColor" type="color" id="drawing-color" class="w-10 h-10 " />
                </div>
                <div class="mb-4 flex justify-between items-center pr-10">
                    <label for="drawing-shadow-color" class="block mb-2 text-xl font-bold">Shadow color</label>
                    <input type="color" v-model="shadowColor" id="drawing-shadow-color" class="w-10 h-10 " />
                </div>
                <div class="mb-4 flex flex-col justify-center items-center">
                    <label for="drawing-shadow-width" class="block mb-2 text-xl font-bold">Shadow width</label>

                    <input v-model="shadowWidth" type="range" id="drawing-shadow-width" class="w-full range" min="0"
                        max="100" />
                </div>
                <div class="mb-4 flex flex-col justify-center items-center">
                    <label for="drawing-shadow-offset" class="block mb-2 text-xl font-bold">Shadow offset</label>
                    <input type="range" min="0" v-model="shadowOffset" max="100" id="drawing-shadow-offset"
                        class="w-full range" />
                </div>
                <label class="block  mt-8 text-center mb-2 text-xl font-bold">Insert shapes</label>
                <div class="w-full grid mt-4 grid-cols-3 gap-4">
                    <!-- this adds a circle in the canvas -->
                    <Button class="h-20 w-20" variant="outline" @click="addShape('circle')">
                        <div class="w-10 h-10 rounded-full bg-gray-300">

                        </div>
                    </Button>
                    <!-- this adds a triangle in the canvas -->
                    <Button class="h-20 w-20" variant="outline">
                        <div
                            className="w-0 scale-50 h-0 border-b-[86.6px] border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent">
                        </div>
                    </Button>
                    <!-- this adds a line in the canvas -->
                    <Button class="h-20 flex justify-center items-center w-20" variant="outline">
                        <div class="w-full h-1 bg-gray-400 -rotate-45">

                        </div>
                    </Button>
                    <!-- this adds a polygone in the canvas -->

                    <Button class="h-20 w-20" variant="outline"></Button>
                    <!-- this adds a polyline in the canvas -->

                    <Button class="h-20 w-20" variant="outline"></Button>
                    <!-- this adds a rectangle in the canvas -->

                    <Button class="h-20 w-20" variant="outline"></Button>
                </div>
            </div>
        </div>
    </div>
</template>