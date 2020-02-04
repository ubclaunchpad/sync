import { Server, Socket } from "socket.io";
import { Event } from "./event";
import axios from "axios";
import logger from "../config/logger";
import qs from "querystring";
import Video from "../models/video";
import uniqid from "uniqid";

type EventHandler = {
  [event in Event]?: (io: Server, socket: Socket, roomId: string, args: any) => Promise<void>;
};

const handlers: EventHandler = {};

const joinRoom = (io: Server, socket: Socket, roomId: string): void => {
  socket.join(roomId, () => {
    socket.to(roomId).emit(Event.MESSAGE, "A new user has joined the room!");
    for (const [event, handler] of Object.entries(handlers)) {
      if (handler) {
        socket.on(event, async data => {
          await handler(io, socket, roomId, data);
        });
      }
    }
  });
};

handlers[Event.PLAY_VIDEO] = (io: Server, socket: Socket, roomId: string, time: number): Promise<void> => {
  socket.to(roomId).emit(Event.PLAY_VIDEO, time);
  return Promise.resolve();
};

handlers[Event.PAUSE_VIDEO] = (io: Server, socket: Socket, roomId: string, time: number): Promise<void> => {
  socket.to(roomId).emit(Event.PAUSE_VIDEO, time);
  return Promise.resolve();
};

handlers[Event.REQUEST_ADD_TO_QUEUE] = async (
  io: Server,
  socket: Socket,
  roomId: string,
  videoUrl: string
): Promise<void> => {
  logger.info("REQUEST_ADD_TO_QUEUE called!");

  try {
    // TODO: Improve method of finding video ID to account for extra query parameters
    const videoId = videoUrl.split("v=")[1];

    const videoInfoResponse = await axios.get(`https://youtube.com/get_video_info?video_id=${videoId}`);
    const videoInfo = qs.parse(videoInfoResponse.data);
    const playerResponse = JSON.parse(videoInfo["player_response"] as string);
    const videoTitle = playerResponse.videoDetails.title;
    logger.info(`Video found: ${videoTitle}`);

    const video: Video = { id: uniqid(), title: videoTitle, url: videoUrl };
    io.in(roomId).emit(Event.ADD_TO_QUEUE, video);
  } catch {
    logger.error("Failed to find info about video");
  }
};

handlers[Event.SET_VIDEO] = (io: Server, socket: Socket, roomId: string, video: Video): Promise<void> => {
  io.in(roomId).emit(Event.SET_VIDEO, video);
  return Promise.resolve();
};

export default joinRoom;
