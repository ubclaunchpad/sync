import React from "react";
import io from "socket.io-client";
import axios, { AxiosResponse } from "axios";
import Lottie from "react-lottie";
import Event from "../sockets/event";
import "../styles/Room.css";
import loadingIndicator from "../lotties/loading.json";
import Player from "./Player";
import Chat from "./Chat";
import Share from "./Share";
import Queue from "./Queue";
import Video from "../models/video";
import RoomInfo from "../models/room";
import { RouteComponentProps } from "react-router-dom";
import Message from "../models/message";
import { uniqueNamesGenerator, Config, colors, animals } from "unique-names-generator";
import RoomData from "../models/room";
import VideoState, { PlayerState } from "../models/videoState";
import UpdateVideoStateRequest from "../models/updateVideoStateRequest";
import { Modal, Backdrop, Fade, withStyles, Container } from "@material-ui/core";
import Username from "./Username";
import VideoChat from "./VideoChat";
import { runInThisContext } from "vm";

enum ModalType {
  NONE = 0,
  CREATE_USERNAME = 1
}

const customNameConfig: Config = {
  dictionaries: [colors, animals],
  separator: " ",
  length: 2
};

interface Props extends RouteComponentProps {
  match: any;
  classes: any;
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
  modal: ModalType;
  // users: string[];
  users: any;
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
      playerState: PlayerState.UNSTARTED,
      users: {},
      modal: ModalType.NONE
    };
    this.handleOnPause = this.handleOnPause.bind(this);
    this.handleOnPlay = this.handleOnPlay.bind(this);
    this.handleOnStateChange = this.handleOnStateChange.bind(this);
    this.handleOnReady = this.handleOnReady.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handleOnEnd = this.handleOnEnd.bind(this);
    this.setUsernameAndEmit = this.setUsernameAndEmit.bind(this);
    this.setModalState = this.setModalState.bind(this);
    this.changeUsernameAndEmit = this.changeUsernameAndEmit.bind(this);
    this.handleSetUsers = this.handleSetUsers.bind(this);
    this.handleSetUsername = this.handleSetUsername.bind(this);
  }

  //Creates an object of users { key: id, value : username}
  //If users were previously set, just update this.state.newUsers
  //If initializing users, set all username values to null
  handleSetUsers(users: string[]) {
    if (Object.keys(this.state.users).length > 0) {
      users.map(user => {
        if (!(user in this.state.users)) {
          const newState = this.state.users;
          newState[user] = null;
          this.setState({ users: newState });
        }
      });
      this.socket.emit(Event.GET_ALL_USERNAMES);
    } else {
      const userObj: any = {};
      users.map(userId => {
        userObj[userId] = null;
      });
      this.setState({ users: userObj });
      this.socket.emit(Event.GET_ALL_USERNAMES);
    }
  }

  handleOnPause(event: { target: any; data: number }) {
    const player = event.target;
    this.socket.emit(Event.PAUSE_VIDEO, player.getCurrentTime());
  }

  handleOnPlay(event: { target: any; data: number }) {
    const player = event.target;
    this.socket.emit(Event.PLAY_VIDEO, player.getCurrentTime());
  }

  handleOnEnd(event: { target: any; data: number }) {
    this.socket.emit(Event.VIDEO_ENDED, this.state.videoQueue[0]);
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
  handleSetUsername(user: any) {
    const users = this.state.users;
    users[user.id] = user.name;
    this.setState({ users: users });
  }

  changeUsernameAndEmit(givenUsername: string): void {
    this.setState(
      {
        username: givenUsername,
        modal: ModalType.NONE
      },
      () => {
        this.socket.emit(Event.CREATE_USERNAME, this.state.username);
      }
    );
  }

  setModalState(): void {
    if (typeof this.props.location.state === "undefined") {
      this.setState({
        modal: ModalType.CREATE_USERNAME
      });
    }
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    this.socket.on(Event.CONNECT, () => {
      this.socket.emit(Event.JOIN_ROOM, id);
      this.setUsernameAndEmit();
      this.socket.emit(Event.CREATE_USERNAME, this.props.location.state.username);
      this.socket.on("CLIENTS", (clients: string[]) => {
        this.handleSetUsers(clients);
      });
      this.socket.on(Event.GET_ALL_USERNAMES, (user: any) => {
        this.handleSetUsername(user);
      });
    });
    this.setUsernameAndEmit();
    this.setModalState();

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
    const { classes } = this.props;
    const username = this.state.username;
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
          <Queue videos={this.state.videoQueue} socket={this.socket} />
        </React.Fragment>
      ) : null;

    const invalidRoomId =
      this.state.isLoaded && !this.state.isValid ? <h1 style={{ color: "white" }}>Invalid room id :(</h1> : null;

    const showLoadingIndicator = !this.state.isLoaded ? (
      <Lottie options={defaultOptions} height={400} width={400} />
    ) : null;

    return (
      <div className="container">
        <Share roomUrl={window.location.href} />
        {videoPlayer}
        {invalidRoomId}
        {showLoadingIndicator}
        <Container style={{ background: "#030B1E", width: "50vw" }}>
          {username && <VideoChat username={username} users={this.state.users} socket={this.socket} />}
          <Chat username={this.state.username} messages={this.state.messages} sendMessage={this.handleSendMessage} />
        </Container>
        <Modal
          disableAutoFocus={true}
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={this.state.modal == ModalType.CREATE_USERNAME}
          onClose={() => {
            this.setState({
              modal: ModalType.NONE
            });
          }}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500
          }}
        >
          <Fade in={this.state.modal == ModalType.CREATE_USERNAME}>
            <div className={classes.paper}>
              <Username changeUsernameAndEmit={this.changeUsernameAndEmit} />
            </div>
          </Fade>
        </Modal>
      </div>
    );
  }
}

const materialUiStyles = {
  root: {
    background: "#000000",
    height: "292px",
    width: "212px",
    marginRight: "50px",
    marginLeft: "50px",
    border: "2px solid #051633",
    borderRadius: "10px",
    opacity: "1 !important"
  },
  textPrimary: {
    color: "white"
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    backgroundColor: "white",
    border: "1px solid #000",
    width: "905px",
    height: "400px",
    borderRadius: "20px",
    outline: "none"
  }
};

export default withStyles(materialUiStyles)(Room);
