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
    let clients = 0;
    let clientNum = 1;
    let videoChatSet: string[] = [];
    let videoChats: any = {};
    io.on(Event.CONNECT, socket => {
      logger.debug(`Socket ${socket.id} connected.`);
      // videoChatSet.push('Test');
      // console.log('videoChatSetHas: ' + videoChatSet.has('test'));


      socket.on(Event.JOIN_ROOM, roomId => {
        new RoomSocketHandler(this.database, io, socket, roomId).initialize();
      });

      socket.on('SEND_INVITE', (invObj) => {
        // console.log('INV_OBJ: ' + invObj);
        socket.broadcast.emit('SEND_INVITE', invObj);
      })

      socket.on('ACCEPT_INVITE', (acceptObj) => {
        socket.broadcast.emit('ACCEPT_INVITE', acceptObj);
      })

      socket.on('SEND_VIDEOCHATID', (videoChatIdObj) => {
        // console.log('videoChatIdObj: ' + JSON.stringify(videoChatIdObj));
        socket.broadcast.emit('SEND_VIDEOCHATID', videoChatIdObj);
      })

      socket.on('JOINED_VIDEOCHAT', (data) => {
        videoChatSet.push(data);
        io.emit('VIDEOCHAT_LIST', videoChatSet);
      })

      // this.socket.emit('VIDEO_CHAT', this.state.videoChatId);
      socket.on('VIDEO_CHAT', (id: any) => {
        console.log('Joining videoChat: ' + id);
        socket.join(id);
      })

      socket.on('newVideoChatPeer', (videoChatId: any) => {
        if (!(videoChatId in videoChats)) {
          videoChats[videoChatId] = { numClients: 0, clientNum: 0 };
          // console.log('videoChatsObj: ' + JSON.stringify(videoChats[videoChatId]));
        }

        if (videoChats[videoChatId]['numClients'] < 2) {
          if (videoChats[videoChatId]['numClients'] == 1) {
            // console.log('Creating new peer ' + videoChatId + videoChats[videoChatId]['clientNum']);
            socket.to(videoChatId).emit('CreatePeer');
            // socket.emit('CreatePeer', videoChatId);
          }
        }
        else {
          //Already a session going on
          socket.emit('SessionActive');
        }
        videoChats[videoChatId]['numClients']++;
        if (videoChats[videoChatId]['clientNum'] < 2) {
          videoChats[videoChatId]['clientNum']++;
        }

      })

      socket.on('Offer', (offerObj: any) => {
        //offerObj = {data:data, videoChatId:videoChatId};
        // console.log('Sending backOffer ' + clientNum);
        socket.to(offerObj.videoChatId).emit("BackOffer", offerObj.data);
        // socket.broadcast.emit("BackOffer", offer);
      });

      // socket.on('Offer', (offer) => {
      //   console.log('Sending backOffer ' + clientNum);
      //   //socket.to(id).emit("BackOffer", offer)
      //   socket.broadcast.emit("BackOffer", offer);
      // });
      socket.on('Answer', (answerObj: any) => {
        //answerObj = { data: data, videoChatId: videoChatId };
        // console.log('Sending backAnswer ' + clientNum);
        //socket.to(id).emit("BackAnswer", data)
        socket.to(answerObj.videoChatId).emit("BackAnswer", answerObj.data);
      });

      socket.on(Event.DISCONNECT, socket => {
        logger.debug(`Socket ${socket.id} disconnected.`);
      });
    });
  }
}
