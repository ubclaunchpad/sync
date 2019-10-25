import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import socketIo from 'socket.io';
import router from './routes';

const PORT = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);

io.on('connection', (socket) => {
  console.log('User connected');
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
