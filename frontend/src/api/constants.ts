export enum ClientEvent {
  SERVER_URL = 'http://localhost:8080/',
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  MESSAGE = 'message',
  EVENT_FROM_SERVER_TEST = 'eventFromServerTest',
  EVENT_TO_SERVER_TEST = 'eventToServerTest',
  EVENT_TO_ALL_TEST = 'eventToAllTest',
  PLAY = 'play',
  PLAY_ALL = 'playAll',
  PAUSE = 'pause',
  PAUSE_ALL = 'pauseAll',
  JOIN_ROOM = 'joinRoom',
}