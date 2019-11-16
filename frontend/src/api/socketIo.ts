import io from "socket.io-client";
import { ClientEvent } from './constants';

function init() {
  const socket = io(ClientEvent.SERVER_URL);
  socket.on(ClientEvent.CONNECT, () => {
    console.log(socket.id);
  });
}

export { init };
