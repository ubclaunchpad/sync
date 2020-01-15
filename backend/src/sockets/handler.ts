import { Server, Socket } from 'socket.io';
import { Event } from "./event";

type EventHandler = {
  [event in Event]?: Function;
};

const handlers: EventHandler = {};

const joinRoom = (io: Server, socket: Socket, roomId: string) => {
  socket.join(roomId, () => {
    socket.to(roomId).emit(Event.MESSAGE, "A new user has joined the room!");
    for (const [event, handler] of Object.entries(handlers)) {
      if (handler) {
        socket.on(event, (data) => {
          handler(io, socket, roomId, data);
        });
      }
    }
  });
}

handlers[Event.PLAY_VIDEO] = (io: Server, socket: Socket, roomId: string, time: number) => {
  socket.to(roomId).emit(Event.PLAY_VIDEO, time);
}

handlers[Event.PAUSE_VIDEO] = (io: Server, socket: Socket, roomId: string, time: number) => {
  socket.to(roomId).emit(Event.PAUSE_VIDEO, time);
}

export default joinRoom;
