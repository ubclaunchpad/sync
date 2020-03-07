import Video from "./video";

export default interface Room {
  name: string;
  currVideoId: string;
  videoQueue: Video[];
}
