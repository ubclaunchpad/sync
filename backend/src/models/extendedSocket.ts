import socketIo from "socket.io";

export default interface ExtendedSocket extends socketIo.Socket {
  username?: string;
}
