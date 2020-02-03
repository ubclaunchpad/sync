import React from "react";
import io from "socket.io-client";
import axios from "axios";
import Lottie from "react-lottie";
import YouTube from "react-youtube";
import { Event } from "../sockets/event";
import "../styles/Room.css";
import loadingIndicator from "../lotties/loading.json";
import Chat from "./Chat";

interface Props {
  match: any;
}

interface State {
  isValid: boolean;
  isLoaded: boolean;
  name: string;
  currVideoId: string;
  messages: string[];
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
      messages: []
    };
    this.handleOnPause = this.handleOnPause.bind(this);
    this.handleOnPlay = this.handleOnPlay.bind(this);
    this.handleOnStateChange = this.handleOnStateChange.bind(this);
    this.handleOnReady = this.handleOnReady.bind(this);
  }

  handleOnPause(event: { target: any; data: number }) {
    const player = event.target;
    this.socket.emit(Event.PAUSE_VIDEO, player.getCurrentTime());
  }

  handleOnPlay(event: { target: any; data: number }) {
    const player = event.target;
    this.socket.emit(Event.PLAY_VIDEO, player.getCurrentTime());
  }

  handleOnStateChange(event: { target: any; data: number }) {
    console.log("State has changed");
  }

  addMessage = (message: string) => {
    this.setState(prevState => ({
      messages: [...prevState.messages, message]
    }));
  };

  handleSendMessage = (data: string) => {
    if (data) {
      this.socket.emit(Event.MESSAGE, data);
      this.addMessage(data);
    }
  };

  handleOnReady(event: { target: any }) {
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

    this.socket.on(Event.MESSAGE, (dataFromServer: any) => {
      this.addMessage(dataFromServer);
    });
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    this.socket.on(Event.CONNECT, () => {
      this.socket.emit(Event.JOIN_ROOM, id);
    });
    try {
      const res = await axios.get("http://localhost:8080/rooms/" + id);
      if (res && res.status === 200) {
        this.setState({
          currVideoId: res.data.url.replace("https://www.youtube.com/watch?v=", ""),
          isLoaded: true,
          isValid: true,
          name: res.data.name
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
          <YouTube
            videoId={this.state.currVideoId}
            onReady={this.handleOnReady}
            onPlay={this.handleOnPlay}
            onStateChange={this.handleOnStateChange}
            onPause={this.handleOnPause}
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
        <Chat messages={this.state.messages} sendMessage={this.handleSendMessage} />
      </div>
    );
  }
}

export default Room;
