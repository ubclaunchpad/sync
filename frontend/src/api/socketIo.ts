import io from "socket.io-client";
import { ClientEvent } from './constants';

function init() {
  const socket = io(ClientEvent.SERVER_URL);
  socket.on(ClientEvent.CONNECT, () => {
    console.log(socket.id);
  });

  socket.on(ClientEvent.EVENT_FROM_SERVER_TEST, (dataFromServer: any) => {
    console.log(dataFromServer);
    socket.emit(ClientEvent.EVENT_TO_SERVER_TEST, {data: "Data from the client"});
  });

  socket.on(ClientEvent.EVENT_TO_ALL_TEST, (dataFromServer: any) => {
    console.log(dataFromServer);
  });
}

export { init };
