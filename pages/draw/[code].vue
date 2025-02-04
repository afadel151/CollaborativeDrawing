<script setup>
import { useSupabaseClient, useSupabaseUser } from '#imports';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
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
const supabase = useSupabaseClient();
const user = useSupabaseUser();
let line;
let canvas;
let mouseDown = false;
const LineDrawing = ref(false);
function activateAddinLine() {
    LineDrawing.value = !LineDrawing.value;
    if (LineDrawing.value == true) {
        canvas.isDrawingMode = false;
        canvas.on('mouse:down', startAddingLine);
        canvas.on('mouse:move', startDrawingLine);
        canvas.on('mouse:up', stopDrawingLine);
    }else{
        canvas.isDrawingMode = true;
        canvas.off('mouse:down', startAddingLine);
        canvas.off('mouse:move', startDrawingLine);
        canvas.off('mouse:up', stopDrawingLine);
    }
}
const DrawingLine = ref(false)
function startAddingLine(o) {
    mouseDown = true;
    let pointer = canvas.getPointer(o.e);
    line = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
        stroke: LineColor.value,
        strokeWidth: 3,
        id: `triangle-${Date.now()}`
    });
    canvas.add(line);
    canvas.requestRenderAll();
}
function startDrawingLine(o) {
    if (mouseDown === true) {
        let pointer = canvas.getPointer(o.e);
        line.set({
            x2: pointer.x,
            y2: pointer.y
        });
        canvas.requestRenderAll();
    }


}
function stopDrawingLine() {
    mouseDown = false;
    socket.emit('draw', {
        roomCode,
        type: 'add',
        object: line.toObject(['id']), // Include 'id' in the serialized object
    });
    
}
onMounted(() => {
    const onlineUsers = supabase.channel('users_online', {
        config: {
            presence: {
                key: user.id,
            },
        },
    })
    const userStatus = {
        user_id: user.id,
        online_at: new Date().toISOString(),
    }
    onlineUsers.subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') { return }

        const presenceTrackStatus = await onlineUsers.track(userStatus)
        console.log(presenceTrackStatus)
    })
    onlineUsers.on('presence', { event: 'sync' }, () => {
        const newState = onlineUsers.presenceState()
        console.log('enter', newState)
    })
    onlineUsers.on('broadcast', { event: 'enter' }, (payload) => console.log(payload))



    const $ = (id) => document.getElementById(id);
    socket.emit('join-room', roomCode);
    canvas = new fabric.Canvas(document.getElementById('c'), {
        isDrawingMode: true,
    });
    const width = window.innerWidth * 0.6;  // 80% of viewport width
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
        canvas.requestRenderAll();
    });
    canvas.on('object:rotating', (event) => {
        const object = event.target;
        socket.emit('draw', {
            roomCode,
            type: 'rotate',
            object: object.toObject(), // Send object properties (rotation, etc.)
        });
        canvas.requestRenderAll();
    });
    canvas.on('object:scaling', (event) => {
        const object = event.target;
        socket.emit('draw', {
            roomCode,
            type: 'scale',
            object: object.toObject(), // Send object properties (scale, etc.)
        });
        canvas.requestRenderAll();
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
        socket.emit('clear', {
            roomCode,
        });
    };
    socket.on('clear', (data) => {
        canvas.clear();
    })
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
        console.log('draw', data);
        console.log(data.roomCode);



        console.log(data.type);
        if (data.type === 'path') {
            console.log('draw3');
            canvas.add(new fabric.Path(data.path, data.options));
            canvas.requestRenderAll();
        } else if (data.type === 'clear') {
            console.log('draw4');
            canvas.clear();
        }
        if (data.type === 'add') {
            const existingObject = canvas.getObjects().find(o => o.id === data.object.id);
            console.log('draw1');
            if (!existingObject) {
                console.log('draw2');
                fabric.util.enlivenObjects([data.object], function (objects) {
                    objects.forEach(obj => {
                        obj.set({ id: data.object.id });
                        canvas.add(obj);
                    });
                    canvas.requestRenderAll();
                });
            }
        }

        if (data.type === 'move' || data.type === 'rotate' || data.type === 'scale') {
            console.log('draw5');
            const { object } = data;
            const fabricObject = canvas.getObjects().find(o => o.id === object.id); // Find object by ID
            if (fabricObject) {
                fabricObject.set(object); // Update the object with the new properties
                canvas.requestRenderAll();
            }

        }


    });
    canvas.on('path:created', (event) => {
        const path = event.path;
        console.log('path created');

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
                fill: LineColor.value,
                id: `circle-${Date.now()}`, // Ensure ID is set
            });
            break;
        case 'rectangle':
            shape = new fabric.Rect({
                left: 150,
                top: 150,
                width: 100,
                height: 100,
                fill: LineColor.value,
                id: `rectangle-${Date.now()}`, // Ensure ID is set
            });
            break;
        case 'triangle':
            shape = new fabric.Triangle({
                left: 200,
                top: 200,
                width: 80,
                height: 80,
                fill: LineColor.value,
                id: `triangle-${Date.now()}`, // Ensure ID is set
            });
            break;
        case 'line':
            // shape = new fabric.Line([50, 50, 200, 200], {
            //     stroke: 'black',
            //     strokeWidth: 5,
            //     id: `line-${Date.now()}`, // Ensure ID is set
            // });
            activateAddinLine();
            break;
        case 'polygone':
            const sides = 6; // Hexagon
            const radius = 50; // Adjust size
            const centerX = 200;
            const centerY = 200;
            const points = Array.from({ length: sides }, (_, i) => {
                const angle = (Math.PI / 3) * i; // 360° / 6 = 60° per step
                return {
                    x: centerX + radius * Math.cos(angle),
                    y: centerY + radius * Math.sin(angle),
                };
            });

            shape = new fabric.Polygon(points, {
                stroke: LineColor.value,
                fill: 'transparent',
                left: centerX,
                top: centerY,
                id: `hexagon-${Date.now()}`,
            });
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
            <canvas id="c" class="border "></canvas>
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
                    <Button class="h-20 w-20" variant="outline" @click="addShape('triangle')">
                        <div
                            className="w-0 scale-50 h-0 border-b-[86.6px] border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent">
                        </div>
                    </Button>
                    <!-- this adds a line in the canvas -->
                    <Button class="h-20 flex justify-center items-center w-20"
                        :variant="LineDrawing ? 'secondary' : 'outline'" @click="addShape('line')">
                        <div class="w-full h-1 bg-gray-400 -rotate-45">

                        </div>
                    </Button>
                    <!-- this adds a polygone in the canvas -->

                    <Button class="h-20 w-20" variant="outline" @click="addShape('polygone')">
                        <div className="flex scale-50">
                            <div>
                                <div className="w-[100px] h-[50px] relative">
                                    <div
                                        className="absolute top-[25px] border-l-[50px] border-r-[50px] border-b-[25px]">
                                    </div>
                                    <div
                                        className="bottom-[25px] border-l-[50px] border-r-[50px] border-b-[25px] border-l-transparent border-r-transparent">
                                    </div>
                                </div>
                                <div className="w-[100px] rotate-180 h-[50px] relative">
                                    <div
                                        className="absolute top-[25px] border-l-[50px] border-r-[50px] border-b-[25px]">
                                    </div>
                                    <div
                                        className="bottom-[25px] border-l-[50px] border-r-[50px] border-b-[25px] border-l-transparent border-r-transparent">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Button>
                    <!-- this adds a polyline in the canvas -->

                    <Button class="h-20 w-20" variant="outline"></Button>
                    <!-- this adds a rectangle in the canvas -->

                    <Button class="h-20 w-20" variant="outline" @click="addShape('rectangle')">
                        <div className="h-[40px] w-[40px] bg-gray-200"></div>
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>