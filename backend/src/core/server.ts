import http from 'http';
import express  from 'express';
import bodyParser from "body-parser";
import socketIo from 'socket.io';
import Database from './database';
import API from './api';
import { Event } from "../sockets/event";
import joinRoom from "../sockets/handler";
import logger from "../config/logger";

export default class Server {
  private app: express.Application;
  private port: number;
  private httpServer: http.Server;

  constructor(port?: number) {
    this.port = port || 8080;
    this.app = express();
    this.httpServer = http.createServer(this.app);
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use("/", new API(new Database()).router);
    this.setupSockets();
  }

  public listen(): void {
    this.httpServer.listen(this.port, () => {
      logger.info(`Http server listening on port ${this.port}`);
    });
  }

  private setupSockets(): void {
    const io = socketIo(this.httpServer);
    io.on(Event.CONNECT, (socket) => {
      logger.debug(`Socket ${socket.id} connected.`);

      socket.on(Event.JOIN_ROOM, (roomId) => {
        joinRoom(io, socket, roomId);
      });

      socket.on(Event.DISCONNECT, (socket) => {
        logger.debug(`Socket ${socket.id} disconnected.`);
      })
    });
  }
}
