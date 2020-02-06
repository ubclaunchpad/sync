import Video from "./video";

export default interface Room {
  name: string;
  url: string;
  videoQueue: Video[];
}
