const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins (update in production)
  },
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('join-room', (roomCode) => {
    socket.join(roomCode); // Join the room
    console.log(`User ${socket.id} joined room ${roomCode}`);
  });
  socket.on('clear',(data)=>{
    const {roomCode, ...drawData} = data;
    console.log('clear');
    socket.to(roomCode).emit('clear',drawData);
    
  })
  socket.on('draw', (data) => {
    const { roomCode, ...drawData } = data;
    // Broadcast drawing data to all clients in the same room
    console.log('draw ');
    socket.to(roomCode).emit('draw', drawData);
  });
  socket.on('leave-room', (roomCode) => {
    socket.leave(roomCode); // Leave the room
    console.log(`User ${socket.id} left room ${roomCode}`);
  });
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

console.log('Fadel');
