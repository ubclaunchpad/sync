import React from "react";
import io from "socket.io-client";
import axios from "axios";
import Lottie from "react-lottie";
import YouTube from "react-youtube";
import { Event } from "../sockets/event";
import "../styles/Room.css";
import loadingIndicator from "../lotties/loading.json";
import Queue from "./Queue";
import Video from "../models/video";

interface Props {
  match: any;
}

interface State {
  isValid: boolean;
  isLoaded: boolean;
  name: string;
  currVideoId: string;
  videoQueue: Video[];
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
      videoQueue: []
    };
    this.handleOnPause = this.handleOnPause.bind(this);
    this.handleOnPlay = this.handleOnPlay.bind(this);
    this.handleOnStateChange = this.handleOnStateChange.bind(this);
    this.handleOnReady = this.handleOnReady.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    this.requestAddToQueue = this.requestAddToQueue.bind(this);
    this.addToQueue = this.addToQueue.bind(this);
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
    console.log("State has changed with data = " + event.data);

    // If event.data is 5, a new video has just been set so we should play it
    if (event.data == 5) {
      event.target.playVideo();
    }
  }

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

    this.socket.on(Event.SET_VIDEO, (video: Video) => {
      const videoQueue: Video[] = [];
      let foundVideo = false;
      for (const v of this.state.videoQueue) {
        if (foundVideo) videoQueue.push(v);
        if (v.id == video.id) foundVideo = true;
      }

      this.setState({ currVideoId: video.url.replace("https://www.youtube.com/watch?v=", ""), videoQueue: videoQueue });
    });
  }

  handleEnd(event: { target: any }) {
    if (this.state.videoQueue.length > 0) this.socket.emit(Event.SET_VIDEO, this.state.videoQueue[0]);
  }

  requestAddToQueue(videoUrl: string): void {
    this.socket.emit(Event.REQUEST_ADD_TO_QUEUE, videoUrl);
  }

  addToQueue(video: Video): void {
    const videoQueue = this.state.videoQueue;
    videoQueue.push(video);
    this.setState({ videoQueue });
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    this.socket.on(Event.CONNECT, () => {
      this.socket.emit(Event.JOIN_ROOM, id);
    });
    this.socket.on(Event.ADD_TO_QUEUE, (video: Video) => this.addToQueue(video));
    try {
      const res = await axios.get("http://localhost:8080/rooms/" + id);
      if (res && res.status === 200) {
        this.setState({
          currVideoId: res.data.url.replace("https://www.youtube.com/watch?v=", ""),
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
          <YouTube
            videoId={this.state.currVideoId}
            onReady={this.handleOnReady}
            onPlay={this.handleOnPlay}
            onStateChange={this.handleOnStateChange}
            onPause={this.handleOnPause}
            onEnd={this.handleEnd}
          />
          <Queue onAddVideo={this.requestAddToQueue} videos={this.state.videoQueue} />
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
      </div>
    );
  }
}

export default Room;
