import Video from "./video";
import { PlayerState } from "./videoState";

export default interface Room {
  name: string;
  default: boolean;
  private: boolean;
  currVideoTitle: string;
  currVideoId: string;
  videoQueue: Video[];
  playerState: PlayerState;
}
