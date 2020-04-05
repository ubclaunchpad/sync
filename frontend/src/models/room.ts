import Video from "./video";

export default interface Room {
  name: string;
  currVideoTitle: string;
  currVideoId: string;
  videoQueue: Video[];
}
