export interface RoomInfo {
  name: string;
  videoTitle: string;
  videoId: string;
  videoQueue: Video[];
}

export interface Video {
  id: string;
  title: string;
  youtubeId: string;
  channel: string;
  lengthInSeconds: number;
}

export interface VideoState {
  secondsElapsed: number;
  playerState: PlayerState;
}

export enum PlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 5
}

export interface Message {
  user?: string;
  message: string;
}

export interface VideoStateUpdate {
  videoState: VideoState;
  socketId: string;
}
