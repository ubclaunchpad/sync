import http from 'http';
import express  from 'express';
import bodyParser from 'body-parser';
import socketIo from 'socket.io';
import router from './routes';
import  { ServerEvent }  from './constants';

const PORT = process.env.PORT || 8080; 
const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const io = socketIo(server);
io.on(ServerEvent.CONNECT, (socket) => {
  console.log('User connected');
  
  socket.emit(ServerEvent.EVENT_FROM_SERVER_TEST, {data: "Welcome to the socketio server"});

  socket.on(ServerEvent.EVENT_TO_SERVER_TEST, (dataFromClient) => {
    console.log('Event from client received'+ dataFromClient);
    io.emit(ServerEvent.EVENT_TO_ALL_TEST, 'io.emit to all test');
  });

  //TODO: When a client presses play, send a play command to all clients
  socket.on(ServerEvent.PLAY, () => {
    socket.broadcast.emit(ServerEvent.PLAY, {data: 'Play from server'});
  });

  //TODO: When a client pauses, send a pause command to all clients
  socket.on(ServerEvent.PAUSE, () => {
    socket.broadcast.emit(ServerEvent.PAUSE, {data: 'Pause from server'});
  });
});
