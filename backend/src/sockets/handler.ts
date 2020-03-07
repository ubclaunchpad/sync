import { Server, Socket } from "socket.io";
import { Event } from "./event";
import axios from "axios";
import logger from "../config/logger";
import qs from "querystring";
import Video from "../models/video";
import uniqid from "uniqid";
import Database from "../core/database";
import VideoState, { PlayerState } from "../models/videoState";
import UpdateVideoStateRequest from "../models/updateVideoStateRequest";

interface Message {
  user: string;
  message: string;
}

type EventHandler = {
  [event in Event]?: (args: any) => Promise<void>;
};

class RoomSocketHandler {
  private database: Database;
  private io: Server;
  private socket: Socket;
  private roomId: string;

  constructor(database: Database, io: Server, socket: Socket, roomId: string) {
    this.database = database;
    this.io = io;
    this.socket = socket;
    this.roomId = roomId;
  }

  initialize(): void {
    this.socket.join(this.roomId, () => {
      const handlers = this.createEventHandler();

      this.socket.to(this.roomId).emit(Event.MESSAGE, "A new user has joined the room!");
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
      [Event.MESSAGE]: (message: Message): Promise<void> => this.sendMessage(message),
      [Event.PLAY_VIDEO]: (time: number): Promise<void> => this.playVideo(time),
      [Event.PAUSE_VIDEO]: (time: number): Promise<void> => this.pauseVideo(time),
      [Event.REMOVE_FROM_QUEUE]: (id: string): Promise<void> => this.removeFromQueue(id),
      [Event.REQUEST_ADD_TO_QUEUE]: (videoUrl: string): Promise<void> => this.tryAddToQueue(videoUrl),
      [Event.REQUEST_VIDEO_STATE]: (): Promise<void> => this.getVideoState(),
      [Event.SET_VIDEO]: (video: Video): Promise<void> => this.setVideo(video),
      [Event.UPDATE_VIDEO_STATE]: (request: UpdateVideoStateRequest): Promise<void> => this.updateVideoState(request)
    };
  }

  private playVideo(time: number): Promise<void> {
    this.socket.to(this.roomId).emit(Event.PLAY_VIDEO, time);
    return Promise.resolve();
  }

  private pauseVideo(time: number): Promise<void> {
    this.socket.to(this.roomId).emit(Event.PAUSE_VIDEO, time);
    return Promise.resolve();
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
      room.videoQueue.push(video);
      await this.database.setRoom(this.roomId, room);

      this.io.in(this.roomId).emit(Event.UPDATE_ROOM, room);
    } catch {
      logger.error("Failed to find info about video");
    }
  }

  private async removeFromQueue(id: string): Promise<void> {
    const room = await this.database.getRoom(this.roomId);
    room.videoQueue = room.videoQueue.filter(video => video.id !== id);

    await this.database.setRoom(this.roomId, room);

    this.io.in(this.roomId).emit(Event.UPDATE_ROOM, room);
  }

  private async setVideo(video: Video): Promise<void> {
    const room = await this.database.getRoom(this.roomId);
    room.currVideoId = video.youtubeId;

    const videoQueue: Video[] = [];
    let foundVideo = false;
    for (const v of room.videoQueue) {
      if (foundVideo) videoQueue.push(v);
      if (v.id == video.id) foundVideo = true;
    }
    room.videoQueue = videoQueue;

    await this.database.setRoom(this.roomId, room);

    this.io.in(this.roomId).emit(Event.UPDATE_ROOM, room);
  }

  private sendMessage(message: Message): Promise<void> {
    this.socket.to(this.roomId).emit(Event.MESSAGE, message);
    return Promise.resolve();
  }

  private async getVideoState(): Promise<void> {
    const roomClients = this.io.sockets.adapter.rooms[this.roomId].sockets;
    const roomClientIds = Object.keys(roomClients);
    if (roomClientIds.length <= 1) {
      const initialVideoState: VideoState = { secondsElapsed: 0, playerState: PlayerState.UNSTARTED };
      this.io.to(this.socket.id).emit(Event.UPDATE_VIDEO_STATE, initialVideoState);
    }

    if (roomClientIds[0] !== this.socket.id) {
      this.io.to(roomClientIds[0]).emit(Event.REQUEST_VIDEO_STATE, this.socket.id);
    }
  }

  private async updateVideoState(updateVideoStateRequest: UpdateVideoStateRequest): Promise<void> {
    this.io.to(updateVideoStateRequest.socketId).emit(Event.UPDATE_VIDEO_STATE, updateVideoStateRequest.videoState);
  }
}

export default RoomSocketHandler;
