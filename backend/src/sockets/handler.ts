import { Server, Socket } from "socket.io";
import Event from "./event";
import axios from "axios";
import logger from "../config/logger";
import qs from "querystring";
import Video from "../models/video";
import uniqid from "uniqid";
import Database from "../core/database";
import Message from "../models/message";
import ExtendedSocket from "../models/extendedSocket";
import VideoState, { PlayerState } from "../models/videoState";
import UpdateVideoStateRequest from "../models/updateVideoStateRequest";
import Room from "../models/room";

type EventHandler = {
  [event in Event]?: (args: any) => Promise<void>;
};

class RoomSocketHandler {
  private database: Database;
  private io: Server;
  private socket: ExtendedSocket;
  private roomId: string;

  constructor(database: Database, io: Server, socket: ExtendedSocket, roomId: string) {
    this.database = database;
    this.io = io;
    this.socket = socket;
    this.roomId = roomId;
  }

  initialize(): void {
    this.socket.join(this.roomId, () => {
      const handlers = this.createEventHandler();
      const newJoin: Message = {
        message: "A new user has joined the room!"
      };
      this.socket.to(this.roomId).emit(Event.MESSAGE, newJoin);

      this.io.of('/').in(this.roomId).clients((error: any, clients: any) => {
        if (error) throw error;
        this.io.in(this.roomId).emit('CLIENTS', clients);
      });

      for (const [event, handler] of Object.entries(handlers)) {
        if (handler) {
          this.socket.on(event, async data => {
            logger.debug(`Socket ${this.socket.id} sent ${event} with ${JSON.stringify(data)}`);
            await handler(data);
          });
        }
      }
    });
  }

  private createEventHandler(): EventHandler {
    return {
      [Event.CREATE_USERNAME]: (username: string): Promise<void> => this.createUsername(username),
      [Event.MESSAGE]: (message: Message): Promise<void> => this.sendMessage(message),
      [Event.PLAY_VIDEO]: (time: number): Promise<void> => this.playVideo(time),
      [Event.PAUSE_VIDEO]: (time: number): Promise<void> => this.pauseVideo(time),
      [Event.REMOVE_FROM_QUEUE]: (id: string): Promise<void> => this.removeFromQueue(id),
      [Event.REQUEST_ADD_TO_QUEUE]: (videoUrl: string): Promise<void> => this.tryAddToQueue(videoUrl),
      [Event.REQUEST_VIDEO_STATE]: (): Promise<void> => this.getVideoState(),
      [Event.UPDATE_VIDEO_STATE]: (request: UpdateVideoStateRequest): Promise<void> => this.updateVideoState(request),
      [Event.VIDEO_ENDED]: (): Promise<void> => this.handleVideoEnded(),
      [Event.CREATE_USERNAME]: (username: string): Promise<void> => this.createUsername(username),
      [Event.GET_ALL_USERNAMES]: (): Promise<void> => this.getAllUsernames(),
    };
  }

  private createUsername(username: string): Promise<void> {
    this.socket.username = username;
    logger.info(`socket username set to ${this.socket.username}`);
    return Promise.resolve();
  }

  private getAllUsernames(): Promise<void> {
    this.socket.to(this.roomId).emit(Event.GET_ALL_USERNAMES, { id: this.socket.id, name: this.socket.username });
    return Promise.resolve();
  }

  private async playVideo(time: number): Promise<void> {
    const room: Room = await this.database.getRoom(this.roomId);
    if (room.playerState !== PlayerState.PLAYING) {
      this.socket.to(this.roomId).emit(Event.PLAY_VIDEO, time);
      room.playerState = PlayerState.PLAYING;
      await this.database.setRoom(this.roomId, room);
    }
  }

  private async pauseVideo(time: number): Promise<void> {
    const room: Room = await this.database.getRoom(this.roomId);
    if (room.playerState !== PlayerState.PAUSED) {
      this.socket.to(this.roomId).emit(Event.PAUSE_VIDEO, time);
      room.playerState = PlayerState.PAUSED;
      await this.database.setRoom(this.roomId, room);
    }
  }

  private async tryAddToQueue(youtubeId: string): Promise<void> {
    try {
      const videoInfoResponse = await axios.get(`https://youtube.com/get_video_info?video_id=${youtubeId}`);
      const videoInfo = qs.parse(videoInfoResponse.data);
      const playerResponse = JSON.parse(videoInfo["player_response"] as string);
      const videoTitle = playerResponse.videoDetails.title;
      logger.info(`Video found: ${videoTitle}`);

      const video: Video = { id: uniqid(), title: videoTitle, youtubeId: youtubeId };

      const room = await this.database.getRoom(this.roomId);
      if (room.playerState === PlayerState.ENDED) {
        room.currVideoId = video.youtubeId;
      } else {
        room.videoQueue.push(video);
      }

      await this.database.setRoom(this.roomId, room);

      this.io.in(this.roomId).emit(Event.UPDATE_ROOM, room);
      this.socket.emit(Event.ADD_VIDEO_TO_QUEUE_SUCCESS);
    } catch {
      logger.error("Failed to find info about video");
      this.socket.emit(Event.ADD_VIDEO_TO_QUEUE_ERROR);
    }
  }

  private async removeFromQueue(id: string): Promise<void> {
    const room: Room = await this.database.getRoom(this.roomId);
    room.videoQueue = room.videoQueue.filter(video => video.id !== id);

    await this.database.setRoom(this.roomId, room);

    this.io.in(this.roomId).emit(Event.UPDATE_ROOM, room);
  }

  private sendMessage(message: Message): Promise<void> {
    this.socket.to(this.roomId).emit(Event.MESSAGE, message);
    return Promise.resolve();
  }

  private getVideoState(): Promise<void> {
    const roomClients = this.io.sockets.adapter.rooms[this.roomId].sockets;
    const roomClientIds = Object.keys(roomClients);
    logger.debug(JSON.stringify(roomClientIds));
    if (roomClientIds.length <= 1) {
      const initialVideoState: VideoState = { secondsElapsed: 0, playerState: PlayerState.UNSTARTED };
      logger.debug(`Sending UPDATE_VIDEO_STATE to ${this.socket.id} with ${JSON.stringify(initialVideoState)}`);
      this.socket.emit(Event.UPDATE_VIDEO_STATE, initialVideoState);
      return Promise.resolve();
    }

    if (roomClientIds[0] !== this.socket.id) {
      this.io.to(roomClientIds[0]).emit(Event.REQUEST_VIDEO_STATE, this.socket.id);
    } else {
      this.io.to(roomClientIds[1]).emit(Event.REQUEST_VIDEO_STATE, this.socket.id);
    }

    return Promise.resolve();
  }

  private updateVideoState(updateVideoStateRequest: UpdateVideoStateRequest): Promise<void> {
    this.io.to(updateVideoStateRequest.socketId).emit(Event.UPDATE_VIDEO_STATE, updateVideoStateRequest.videoState);
    return Promise.resolve();
  }

  private async handleVideoEnded(): Promise<void> {
    const room: Room = await this.database.getRoom(this.roomId);
    room.playerState = PlayerState.ENDED;
    if (room.videoQueue.length > 0) {
      room.currVideoId = room.videoQueue[0].youtubeId;
      room.videoQueue.shift();
    }
    await this.database.setRoom(this.roomId, room);
    this.io.in(this.roomId).emit(Event.UPDATE_ROOM, room);
  }
}

export default RoomSocketHandler;
