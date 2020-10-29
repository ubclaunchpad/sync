import React from "react";
import { RouteComponentProps } from "react-router-dom";
import io from "socket.io-client";
import axios, { AxiosResponse } from "axios";
import Lottie from "react-lottie";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Grow from "@material-ui/core/Grow";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Event from "../sockets/event";
import Player from "./Player";
import Chat from "./Chat";
import Share from "./Share";
import Queue from "./Queue";
import Username from "./Username";
import VideoChat from "./VideoChat";
import Video from "../models/video";
import RoomInfo from "../models/room";
import RoomData from "../models/room";
import Message from "../models/message";
import { VideoState, PlayerState } from "../models/videoState";
import UpdateVideoStateRequest from "../models/updateVideoStateRequest";
import { uniqueNamesGenerator, Config, colors, animals } from "unique-names-generator";
import { withStyles, createStyles } from "@material-ui/core";
import loadingIndicator from "../lotties/loading.json";
import logo from "../assets/logo.png";

enum ModalType {
  NONE = 0,
  CREATE_USERNAME = 1
}

const customNameConfig: Config = {
  dictionaries: [colors, animals],
  separator: " ",
  length: 2
};

interface Props extends RouteComponentProps<any, {}, { username: string }> {
  match: any;
  classes: any;
}

interface State {
  isValid: boolean;
  isLoaded: boolean;
  name: string;
  currVideoTitle: string;
  currVideoId: string;
  messages: Message[];
  username: string;
  videoQueue: Video[];
  playerState: PlayerState;
  modal: ModalType;
  users: any;
}

class Room extends React.Component<Props, State> {
  private socket: SocketIOClient.Socket;
  private api: string;

  constructor(props: Props) {
    super(props);
    this.api = process.env.REACT_APP_API_URL || "http://localhost:8080";
    this.socket = io.connect(this.api);
    this.state = {
      isValid: false,
      isLoaded: false,
      name: "",
      currVideoId: "",
      currVideoTitle: "",
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
      users.forEach((user) => {
        if (!(user in this.state.users)) {
          const newState = this.state.users;
          newState[user] = null;
          this.setState({ users: newState });
        }
      });
      this.socket.emit(Event.GET_ALL_USERNAMES);
    } else {
      const userObj: any = {};
      users.forEach((userId) => {
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
    this.setState((prevState) => ({
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
      this.addMessage(dataFromServer);
    });
    this.socket.on(Event.UPDATE_ROOM, (room: RoomInfo) => {
      this.setState({
        currVideoId: room.currVideoId,
        currVideoTitle: room.currVideoTitle,
        videoQueue: room.videoQueue
      });
    });

    this.socket.on(Event.UPDATE_VIDEO_STATE, (videoState: VideoState) => {
      if (videoState.playerState === PlayerState.PAUSED) {
        player.seekTo(videoState.secondsElapsed);
        player.pauseVideo();
      } else if (videoState.playerState === PlayerState.PLAYING) {
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

    this.socket.on(Event.REMOVE_USER, (socketId: string) => {
      const users = Object.assign({}, this.state.users);
      delete users[socketId];
      this.setState({ users });
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
        username: givenUsername ? givenUsername : this.state.username,
        modal: ModalType.NONE
      },
      () => {
        this.socket.emit(Event.CREATE_USERNAME, this.state.username);
        this.socket.emit(Event.GET_ALL_USERNAMES);
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
      const res: AxiosResponse<RoomData> = await axios.get(`${this.api}/api/rooms/` + id);
      if (res && res.status === 200) {
        this.setState({
          currVideoId: res.data.currVideoId,
          currVideoTitle: res.data.currVideoTitle,
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
    const { id } = this.props.match.params;
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: loadingIndicator,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    };

    if (!this.state.isLoaded) {
      return <Lottie options={defaultOptions} height={400} width={400} />;
    }

    if (this.state.isLoaded && !this.state.isValid) {
      return (
        <div className={classes.container} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <h1 style={{ color: "white", margin: "0px" }}>Room does not exist :-(</h1>
        </div>
      );
    }

    return (
      <React.Fragment>
        <Grid container>
          <Grid item xs={4}>
            <Link href="/">
              <img className={classes.logo} src={logo} alt="Logo"></img>
            </Link>
          </Grid>
          <Grid item xs={4} style={{ textAlign: "center" }}>
            <p className={classes.roomTitle}>{this.state.name || "Room" + id}</p>
            <p className={classes.videoTitle}>
              <span style={{ fontWeight: "bold" }}>PLAYING: </span>
              {this.state.currVideoTitle}
            </p>
          </Grid>
          <Grid item xs={4} className={classes.shareContainer}>
            <Share roomUrl={window.location.href} />
          </Grid>
        </Grid>

        <Grid container spacing={1} justify="center">
          <Grid item xs={12} md={8}>
            <Player
              videoId={this.state.currVideoId}
              events={{
                onStateChange: this.handleOnStateChange,
                onReady: this.handleOnReady
              }}
              playerVars={{
                color: "white",
                rel: 0,
                modestbranding: 1
              }}
            />
            <Queue videos={this.state.videoQueue} socket={this.socket} />
          </Grid>
          <Grid item xs={12} md={4}>
            {username && <VideoChat username={username} users={this.state.users} socket={this.socket} />}
            <Chat username={this.state.username} messages={this.state.messages} sendMessage={this.handleSendMessage} />
          </Grid>
        </Grid>

        <Modal
          disableAutoFocus={true}
          className={classes.modal}
          open={this.state.modal === ModalType.CREATE_USERNAME}
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
          <Grow in={this.state.modal === ModalType.CREATE_USERNAME}>
            <div className={classes.paper}>
              <Username changeUsernameAndEmit={this.changeUsernameAndEmit} />
            </div>
          </Grow>
        </Modal>
      </React.Fragment>
    );
  }
}

const styles = (theme: any) =>
  createStyles({
    logo: {
      height: "100px",
      paddingTop: "15px",
      paddingLeft: "30px",
      [theme.breakpoints.down("md")]: {
        height: "80px"
      },
      [theme.breakpoints.down("sm")]: {
        height: "60px",
        paddingLeft: "15px"
      }
    },
    roomTitle: {
      fontFamily: "Libre Baskerville",
      color: "#FF6666",
      fontWeight: "bold",
      fontStyle: "italic",
      fontSize: "24px",
      [theme.breakpoints.down("sm")]: {
        marginTop: "30px",
        fontSize: "20px"
      }
    },
    videoTitle: {
      color: "#FFFFFF",
      fontSize: "16px",
      [theme.breakpoints.down("sm")]: {
        display: "none"
      }
    },
    chatContainer: {},
    shareContainer: {
      textAlign: "right",
      paddingRight: "30px",
      paddingTop: "25px ",
      [theme.breakpoints.down("sm")]: {
        paddingRight: "5px"
      }
    },
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    paper: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgb(34, 34, 34)",
      maxWidth: "700px",
      outline: "none",
      borderRadius: "10px",
      padding: "2em",
      boxShadow: "0px 0px 20px 20px rgb(10 10 10 / 30%)"
    }
  });

export default withStyles(styles)(Room);
