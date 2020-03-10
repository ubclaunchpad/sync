import React from "react";
import io from "socket.io-client";
import axios, { AxiosResponse } from "axios";
import Lottie from "react-lottie";
import { Event } from "../sockets/event";
import "../styles/Room.css";
import loadingIndicator from "../lotties/loading.json";
import Player from "./Player";
import Chat from "./Chat";
import Queue from "./Queue";
import Video from "../models/video";
import RoomInfo from "../models/room";
import { RouteComponentProps } from "react-router-dom";
import { uniqueNamesGenerator, Config, colors, animals } from "unique-names-generator";
import RoomData from "../models/room";
import VideoState, { PlayerState } from "../models/videoState";
import UpdateVideoStateRequest from "../models/updateVideoStateRequest";

const customNameConfig: Config = {
  dictionaries: [colors, animals],
  separator: " ",
  length: 2
};

interface Props extends RouteComponentProps {
  match: any;
}

interface Message {
  user: string;
  message: string;
}

interface State {
  isValid: boolean;
  isLoaded: boolean;
  name: string;
  currVideoId: string;
  messages: Message[];
  username: string;
  videoQueue: Video[];
  playerState: PlayerState;
}

class Room extends React.Component<Props, State> {
  private socket: SocketIOClient.Socket;

  constructor(props: Props) {
    super(props);
    this.socket = io.connect("http://localhost:8080/");
    this.state = {
      isValid: false,
      isLoaded: false,
      name: "",
      currVideoId: "",
      messages: [],
      username: "",
      videoQueue: [],
      playerState: PlayerState.UNSTARTED
    };
    this.handleOnPause = this.handleOnPause.bind(this);
    this.handleOnPlay = this.handleOnPlay.bind(this);
    this.handleOnStateChange = this.handleOnStateChange.bind(this);
    this.handleOnReady = this.handleOnReady.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handleOnEnd = this.handleOnEnd.bind(this);
    this.requestAddToQueue = this.requestAddToQueue.bind(this);
    this.addToQueue = this.addToQueue.bind(this);
    this.removeFromQueue = this.removeFromQueue.bind(this);
    this.setUsernameAndEmit = this.setUsernameAndEmit.bind(this);
  }

  handleOnPause(event: { target: any; data: number }) {
    const player = event.target;
    this.socket.emit(Event.PAUSE_VIDEO, player.getCurrentTime());
  }

  handleOnPlay(event: { target: any; data: number }) {
    const player = event.target;
    this.socket.emit(Event.PLAY_VIDEO, player.getCurrentTime());
  }

  handleOnCued(event: { target: any; data: number }) {
    event.target.playVideo();
  }

  handleOnEnd(event: { target: any; data: number }) {
    if (this.state.videoQueue.length > 0) {
      this.socket.emit(Event.SET_VIDEO, this.state.videoQueue[0]);
    }
  }

  handleOnStateChange(event: { target: any; data: number }) {
    console.log("State has changed with data = " + event.data);
    switch (event.data) {
      case PlayerState.ENDED:
        this.handleOnEnd(event);
        break;
      case PlayerState.PLAYING:
        this.handleOnPlay(event);
        break;
      case PlayerState.PAUSED:
        this.handleOnPause(event);
        break;
      case PlayerState.BUFFERING:
        break;
      case PlayerState.CUED:
        this.handleOnCued(event);
        break;
    }

    this.setState({ playerState: event.data });
  }

  addMessage = (message: Message) => {
    this.setState(prevState => ({
      messages: [...prevState.messages, message]
    }));
  };

  handleSendMessage = (data: string) => {
    if (data) {
      const toSend: Message = {
        user: this.state.username,
        message: data
      };
      this.socket.emit(Event.MESSAGE, toSend);
      this.addMessage(toSend);
    }
  };

  handleSignIn = (data: string) => {
    if (data) {
      this.setState({ username: data });
    }
  };

  handleOnReady(event: { target: any }) {
    console.log("Called handleOnready");
    const player = event.target;

    this.socket.on(Event.PLAY_VIDEO, (time: number) => {
      if (time && Math.abs(time - player.getCurrentTime()) > 0.5) {
        player.seekTo(time);
      }
      player.playVideo();
    });
    this.socket.on(Event.PAUSE_VIDEO, (time: number) => {
      player.pauseVideo();
    });

    this.socket.on(Event.MESSAGE, (dataFromServer: Message) => {
      console.log(JSON.stringify(dataFromServer));
      this.addMessage(dataFromServer);
    });
    this.socket.on(Event.UPDATE_ROOM, (room: RoomInfo) => {
      this.setState({
        currVideoId: room.currVideoId,
        videoQueue: room.videoQueue
      });
    });

    this.socket.on(Event.UPDATE_VIDEO_STATE, (videoState: VideoState) => {
      console.log("Responding to an UPDATE_VIDEO_STATE with " + JSON.stringify(videoState));
      if (videoState.playerState === PlayerState.PAUSED) {
        console.log("Trying to pause video!");
        player.seekTo(videoState.secondsElapsed);
        player.pauseVideo();
      } else if (videoState.playerState === PlayerState.PLAYING) {
        console.log("Trying to play video!");
        player.seekTo(videoState.secondsElapsed);
        player.playVideo();
      }
    });

    this.socket.on(Event.REQUEST_VIDEO_STATE, (socketId: string) => {
      const updateVideoStateRequest: UpdateVideoStateRequest = {
        socketId,
        videoState: { secondsElapsed: player.getCurrentTime(), playerState: this.state.playerState }
      };
      this.socket.emit(Event.UPDATE_VIDEO_STATE, updateVideoStateRequest);
    });

    this.socket.emit(Event.REQUEST_VIDEO_STATE);
  }

  requestAddToQueue(youtubeId: string): void {
    this.socket.emit(Event.REQUEST_ADD_TO_QUEUE, youtubeId);
  }

  addToQueue(video: Video): void {
    const videoQueue = this.state.videoQueue;
    videoQueue.push(video);
    this.setState({ videoQueue });
  }

  removeFromQueue(id: string): void {
    this.socket.emit(Event.REMOVE_FROM_QUEUE, id);

    const videoQueue = this.state.videoQueue;
    this.setState({ videoQueue: videoQueue.filter(video => video.id !== id) });
  }

  setUsernameAndEmit(): void {
    if (typeof this.props.location.state === "undefined" || this.props.location.state.username === "") {
      const randomName: string = uniqueNamesGenerator(customNameConfig);
      this.setState(
        {
          username: randomName
        },
        () => {
          this.socket.emit(Event.CREATE_USERNAME, this.state.username);
        }
      );
    } else {
      this.setState(
        {
          username: this.props.location.state.username
        },
        () => {
          this.socket.emit(Event.CREATE_USERNAME, this.state.username);
        }
      );
    }
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    this.socket.on(Event.CONNECT, () => {
      this.socket.emit(Event.JOIN_ROOM, id);
      this.setUsernameAndEmit();
    });

    try {
      const res: AxiosResponse<RoomData> = await axios.get("http://localhost:8080/api/rooms/" + id);
      if (res && res.status === 200) {
        this.setState({
          currVideoId: res.data.currVideoId,
          isLoaded: true,
          isValid: true,
          name: res.data.name,
          videoQueue: res.data.videoQueue
        });
      } else {
        this.setState({
          isLoaded: true,
          isValid: false
        });
      }
    } catch (err) {
      this.setState({
        isLoaded: true,
        isValid: false
      });
    }
  }

  render() {
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: loadingIndicator,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    };
    const { id } = this.props.match.params;
    const videoPlayer =
      this.state.isLoaded && this.state.isValid ? (
        <React.Fragment>
          <h1 style={{ color: "white" }}>{this.state.name || "Room" + id}</h1>
          <Player
            videoId={this.state.currVideoId}
            events={{
              onStateChange: this.handleOnStateChange,
              onReady: this.handleOnReady
            }}
          />
          <Queue
            onAddVideo={this.requestAddToQueue}
            onRemoveVideo={this.removeFromQueue}
            videos={this.state.videoQueue}
          />
        </React.Fragment>
      ) : null;

    const invalidRoomId =
      this.state.isLoaded && !this.state.isValid ? <h1 style={{ color: "white" }}>Invalid room id :(</h1> : null;

    const showLoadingIndicator = !this.state.isLoaded ? (
      <Lottie options={defaultOptions} height={400} width={400} />
    ) : null;

    return (
      <div className="container">
        {videoPlayer}
        {invalidRoomId}
        {showLoadingIndicator}
        {console.log(this.state.messages)}
        <Chat signIn={this.handleSignIn} sendMessage={this.handleSendMessage} />
      </div>
    );
  }
}

export default Room;
