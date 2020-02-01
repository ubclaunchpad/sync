import { Server, Socket } from "socket.io";
import { Event } from "./event";

type EventHandler = {
  [event in Event]?: Function;
};

const handlers: EventHandler = {};

const joinRoom = (io: Server, socket: Socket, roomId: string): void => {
  socket.join(roomId, () => {
    socket.to(roomId).emit(Event.MESSAGE, "A new user has joined the room!");
    for (const [event, handler] of Object.entries(handlers)) {
      if (handler) {
        socket.on(event, data => {
          handler(io, socket, roomId, data);
        });
      }
    }
  });
};

handlers[Event.PLAY_VIDEO] = (io: Server, socket: Socket, roomId: string, time: number): void => {
  socket.to(roomId).emit(Event.PLAY_VIDEO, time);
};

handlers[Event.PAUSE_VIDEO] = (io: Server, socket: Socket, roomId: string, time: number): void => {
  socket.to(roomId).emit(Event.PAUSE_VIDEO, time);
};

handlers[Event.ADD_TO_QUEUE] = (io: Server, socket: Socket, roomId: string, videoUrl: string): void => {
  socket.to(roomId).emit(Event.ADD_TO_QUEUE, videoUrl);
};

export default joinRoom;
