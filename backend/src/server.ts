import http from 'http';
import express  from 'express';
import socketIo from 'socket.io';
import router from './routes';
import  { ServerEvent }  from './constants';

const PORT = process.env.PORT || 8080; 
const app = express();
const server = http.createServer(app);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', router);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const io = socketIo(server);
io.on(ServerEvent.CONNECT, (socket) => {
  console.log('User connected');

  socket.emit('connect');

  socket.on('room', (roomId) => {
    console.log('room: ' + roomId)
    socket.join(roomId, () => {
      io.to(roomId).emit('a new user has joined the room');
    });
    const playCommand = ServerEvent.PLAY + roomId;
    console.log('playCommand: ' + playCommand);
    socket.on(ServerEvent.PLAY + roomId, ()=> {
      console.log('ServerEvent.PLAY + roomId called');
      // io.sockets.in(roomId).emit(ServerEvent.PLAY, {data: 'Play ' + roomId + ' from server'});
      io.to(roomId).emit(ServerEvent.PLAY + roomId, {data: 'play'});
    })

    socket.on(ServerEvent.PAUSE + roomId, () => {
      io.to(roomId).emit(ServerEvent.PAUSE + roomId, {data: 'Pause from server'});
    });
  });


  
  socket.emit(ServerEvent.EVENT_FROM_SERVER_TEST, {data: "Welcome to the socketio server"});

  socket.on(ServerEvent.EVENT_TO_SERVER_TEST, (dataFromClient) => {
    console.log('Event from client received'+ dataFromClient);
    io.emit(ServerEvent.EVENT_TO_ALL_TEST, 'io.emit to all test');
  });

  //TODO: When a client presses play, send a play command to all clients
  // socket.on(ServerEvent.PLAY, () => {
  //   socket.broadcast.emit(ServerEvent.PLAY, {data: 'Play from server'});
  // });

  //TODO: When a client pauses, send a pause command to all clients
  // socket.on(ServerEvent.PAUSE, () => {
  //   socket.broadcast.emit(ServerEvent.PAUSE, {data: 'Pause from server'});
  // });
});
