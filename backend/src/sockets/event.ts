enum Event {
  ADD_VIDEO_TO_QUEUE_SUCCESS = "add video to queue success",
  ADD_VIDEO_TO_QUEUE_ERROR = "add video to queue error",
  CONNECT = "connect",
  CREATE_USERNAME = "create username",
  DISCONNECT = "disconnect",
  MESSAGE = "message",
  JOIN_ROOM = "join room",
  PLAY_VIDEO = "play video",
  PAUSE_VIDEO = "pause video",
  REMOVE_FROM_QUEUE = "remove from queue",
  REQUEST_ADD_TO_QUEUE = "request add to queue",
  REQUEST_VIDEO_STATE = "request video state",
  UPDATE_ROOM = "update room",
  UPDATE_VIDEO_STATE = "update video state",
  VIDEO_ENDED = "video ended"
}

export default Event;
