import { VideoState } from "./videoState";

export default interface UpdateVideoStateRequest {
  videoState: VideoState;
  socketId: string;
}
