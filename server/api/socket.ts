import { Server } from 'socket.io';

export default defineEventHandler((event) => {
  if (event.node.res.socket?.server?.io) {
    console.log('Socket.io already initialized');
    return;
  }

  const io = new Server(event.node.res.socket.server);

  event.node.res.socket.server.io = io;

  let drawingHistory: any[] = [];

  io.on('connection', (socket) => {
    console.log('A user connected');

    // Send initial drawing history to the new user
    socket.emit('init', drawingHistory);

    // Handle drawing events
    socket.on('drawing', (data) => {
      if (data.isTemp) {
        // Broadcast temporary drawings to all other users
        socket.broadcast.emit('drawing', data);
      } else {
        // Save permanent drawings to history
        drawingHistory.push(data);
        io.emit('drawing', data);
      }
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
});