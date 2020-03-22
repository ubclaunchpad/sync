import http from "http";
import express from "express";
import bodyParser from "body-parser";
import socketIo from "socket.io";
import Database from "./database";
import API from "./api";
import Event from "../sockets/event";
import joinRoom from "../sockets/handler";
import logger from "../config/logger";
import RoomSocketHandler from "../sockets/handler";
import ExtendedSocket from "../models/extendedSocket";

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
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use("/api", new API(this.database).router);
    this.setupSockets();
  }

  public listen(): void {
    this.httpServer.listen(this.port, () => {
      logger.info(`Http server listening on port ${this.port}`);
    });
  }

  private setupSockets(): void {
    const io = socketIo(this.httpServer);
    const videoChats: any = {};
    io.on(Event.CONNECT, socket => {
      logger.debug(`Socket ${socket.id} connected.`);
      logger.info(`Socket ${socket.id} connected.`);
      socket.on(Event.JOIN_ROOM, roomId => {
        new RoomSocketHandler(this.database, io, socket, roomId).initialize();
      });

      socket.on("SEND_INVITE", invite => {
        socket.to(invite.receiver).emit('SEND_INVITE', invite);
      });

      socket.on("ACCEPT_INVITE", accept => {
        socket.to(accept.receiver).emit('ACCEPT_INVITE', accept);
      })

      socket.on("SEND_VIDEOCHATID", videoChatIdObj => {
        socket.to(videoChatIdObj.receiver).emit("SEND_VIDEOCHATID", videoChatIdObj);
      })

      socket.on("VIDEO_CHAT", (id: any) => {
        socket.join(id);
      })

      socket.on("newVideoChatPeer", (videoChatId: any) => {
        if (!(videoChatId in videoChats)) {
          videoChats[videoChatId] = { numClients: 0, clientNum: 0 };
        }

        if (videoChats[videoChatId]["numClients"] < 2) {
          if (videoChats[videoChatId]["numClients"] == 1) {
            socket.to(videoChatId).emit("CreatePeer");
          }
        }
        else {
          //Already a session going on
          //TODO: Remove this??
          socket.emit("SessionActive");
        }
        videoChats[videoChatId]["numClients"]++;
        if (videoChats[videoChatId]["clientNum"] < 2) {
          videoChats[videoChatId]["clientNum"]++;
        }

      })

      socket.on("Offer", (offerObj: any) => {
        socket.to(offerObj.videoChatId).emit("BackOffer", offerObj.data);
      });

      socket.on("Answer", (answerObj: any) => {
        socket.to(answerObj.videoChatId).emit("BackAnswer", answerObj.data);
      });

      socket.on(Event.DISCONNECT, socket => {
        logger.debug(`Socket ${socket.id} disconnected.`);
      });
    });
  }
}
