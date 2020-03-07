import http from "http";
import express from "express";
import bodyParser from "body-parser";
import socketIo from "socket.io";
import Database from "./database";
import API from "./api";
import { Event } from "../sockets/event";
import joinRoom from "../sockets/handler";
import logger from "../config/logger";
import RoomSocketHandler from "../sockets/handler";
import { uniqueNamesGenerator, Config, adjectives, colors, animals } from "unique-names-generator";

const customNameConfig: Config = {
  dictionaries: [colors, animals],
  separator: " ",
  length: 2
};

interface ExtendedSocket extends socketIo.Socket {
  username: string;
}

export default class Server {
  private app: express.Application;
  private port: number;
  private httpServer: http.Server;
  private database: Database;

  constructor(port?: number) {
    this.port = port || 8080;
    this.app = express();
    this.httpServer = http.createServer(this.app);
    this.database = new Database(6379, process.env.DB_HOST);
    this.app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "http://localhost:3000");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use("/", new API(this.database).router);
    this.setupSockets();
  }

  public listen(): void {
    this.httpServer.listen(this.port, () => {
      logger.info(`Http server listening on port ${this.port}`);
    });
  }

  private setupSockets(): void {
    const io = socketIo(this.httpServer);
    io.on(Event.CONNECT, socket => {
      logger.info(`Socket ${socket.id} connected.`);

      socket.on(Event.JOIN_ROOM, roomId => {
        new RoomSocketHandler(this.database, io, socket, roomId).initialize();
      });

      socket.on(Event.DISCONNECT, socket => {
        logger.debug(`Socket ${socket.id} disconnected.`);
      });

      socket.on(Event.CREATE_USERNAME, username => {
        const extSocket = socket as ExtendedSocket;
        if (username === "") {
          const randomName: string = uniqueNamesGenerator(customNameConfig);
          extSocket.username = `Anonymous ${randomName}`;
        } else {
          extSocket.username = username;
        }
        logger.info(`socket username set to ${extSocket.username}`);
      });
    });
  }
}
