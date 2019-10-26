import http, { Server } from 'http';
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import socketIo from 'socket.io';
import router from './routes';
import  { ServerEvent }  from './constants';

const PORT: string | number = process.env.PORT || 8080; //@type?
const app: Application = express();
const server: Server = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const io: SocketIO.Server = socketIo(server);
io.on(ServerEvent.CONNECT, (socket: any) => {
  console.log('User connected');
  
  socket.emit(ServerEvent.EVENT_FROM_SERVER_TEST, {data: "Welcome to the socketio server"});

  socket.on(ServerEvent.EVENT_TO_SERVER_TEST, (dataFromClient: any) => {
    console.log('Event from client received'+ dataFromClient);
    io.emit(ServerEvent.EVENT_TO_ALL_TEST, 'io.emit to all test');
  });

  //TODO: When a client presses play, send a play command to all clients
  socket.on(ServerEvent.PLAY, () => {
    io.emit(ServerEvent.PLAY_ALL, 'Play');
  });
  
  //TODO: When a client pauses, send a pause command to all clients
  socket.on(ServerEvent.PAUSE, () => {
    io.emit(ServerEvent.PAUSE_ALL, 'Pause');
  });
});