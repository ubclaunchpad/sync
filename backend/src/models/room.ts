import Video from "./video";
import { PlayerState } from "./videoState";

export default interface Room {
  name: string;
  currVideoTitle: string;
  currVideoId: string;
  videoQueue: Video[];
  playerState: PlayerState;
}
