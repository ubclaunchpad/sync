import { Server, Socket } from "socket.io";
import { Event } from "./event";
import axios from "axios";
import logger from "../config/logger";
import qs from "querystring";
import Video from "../models/video";
import uniqid from "uniqid";
import Database from "../core/database";

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
            await handler(data);
          });
        }
      }
    });
  }

  private createEventHandler(): EventHandler {
    return {
      [Event.PLAY_VIDEO]: (time: number): Promise<void> => this.playVideo(time),
      [Event.PAUSE_VIDEO]: (time: number): Promise<void> => this.pauseVideo(time),
      [Event.REQUEST_ADD_TO_QUEUE]: (videoUrl: string): Promise<void> => this.requestAddToQueue(videoUrl),
      [Event.SET_VIDEO]: (video: Video): Promise<void> => this.setVideo(video),
      [Event.MESSAGE]: (message: Message): Promise<void> => this.sendMessage(message)
    };
  }

  private playVideo(time: number): Promise<void> {
    logger.info("PLAY_VIDEO");
    this.socket.to(this.roomId).emit(Event.PLAY_VIDEO, time);
    return Promise.resolve();
  }

  private pauseVideo(time: number): Promise<void> {
    this.socket.to(this.roomId).emit(Event.PAUSE_VIDEO, time);
    return Promise.resolve();
  }

  private async requestAddToQueue(videoId: string): Promise<void> {
    logger.info("REQUEST_ADD_TO_QUEUE called!");

    try {
      // TODO: Improve method of finding video ID to account for extra query parameters

      const videoInfoResponse = await axios.get(`https://youtube.com/get_video_info?video_id=${videoId}`);
      const videoInfo = qs.parse(videoInfoResponse.data);
      const playerResponse = JSON.parse(videoInfo["player_response"] as string);
      const videoTitle = playerResponse.videoDetails.title;
      logger.info(`Video found: ${videoTitle}`);

      const video: Video = { id: uniqid(), title: videoTitle, currVideoId: videoId };

      const room = await this.database.getRoom(this.roomId);
      room.videoQueue.push(video);
      await this.database.setRoom(this.roomId, room);

      this.io.in(this.roomId).emit(Event.ADD_TO_QUEUE, video);
    } catch {
      logger.error("Failed to find info about video");
    }
  }

  private async setVideo(video: Video): Promise<void> {
    const room = await this.database.getRoom(this.roomId);
    room.currVideoId = video.currVideoId;

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
}

export default RoomSocketHandler;
