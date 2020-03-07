import Video from "./video";
import VideoState from "./videoState";

export default interface Room {
  name: string;
  currVideoId: string;
  videoQueue: Video[];
}
