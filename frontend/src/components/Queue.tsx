import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Divider,
  InputAdornment
} from "@material-ui/core";
import { createStyles, withStyles } from "@material-ui/core/styles";
import Video from "../models/video";
import Event from "../sockets/event";
import QueueAdd from "../assets/queue-add.svg";
import QueueDelete from "../assets/queue-delete.svg";
import QueueTextBoxIcon from "../assets/queue-text-box-icon.svg";
import TextField from "@material-ui/core/TextField";

interface Props {
  classes: any;
  videos: Video[];
  socket: SocketIOClient.Socket;
}

interface State {
  newVideoUrl: string;
  error: boolean;
}

class Queue extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      newVideoUrl: "",
      error: false
    };
    this.setUpSocket(props.socket);

    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
    this.requestAddToQueue = this.requestAddToQueue.bind(this);
  }

  setUpSocket(socket: SocketIOClient.Socket) {
    console.log("setting up sockets");
    socket.on(Event.ADD_VIDEO_TO_QUEUE_SUCCESS, () => {
      this.setState({ newVideoUrl: "", error: false });
    });

    socket.on(Event.ADD_VIDEO_TO_QUEUE_ERROR, () => {
      this.setState({ error: true });
    });
  }

  handleOnKeyDown(event: React.KeyboardEvent) {
    const code = event.keyCode || event.which;
    if (code === 13) {
      this.requestAddToQueue();
    }
  }

  requestAddToQueue() {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\?v=)([^#&?]*).*/;
    const match = this.state.newVideoUrl.match(regExp);
    if (match && match[2].length === 11) {
      this.props.socket.emit(Event.REQUEST_ADD_TO_QUEUE, match[2]);
    } else {
      this.setState({ error: true });
    }
  }

  getLengthTimecode(lengthInSeconds: number): string {
    const seconds = lengthInSeconds % 60;
    const singleDigit = seconds <= 9;

    return `${Math.floor(lengthInSeconds / 60)}:${singleDigit ? "0" : ""}${lengthInSeconds % 60}`;
  }

  render() {
    const { classes } = this.props;

    const error = this.state.error;
    return (
      <div className={classes.container}>
        <Typography className={classes.listTitle} variant="h5">
          Queue
        </Typography>
        <List component="nav" className={classes.list}>
          {this.props.videos.map((video, i) => (
            <React.Fragment key={i}>
              <ListItem>
                <Typography className={classes.listNumber}>{i + 1}</Typography>
                <ListItemText
                  primary={<Typography className={classes.videoTitle}>{video.title}</Typography>}
                  secondary={
                    <Typography className={classes.videoSubtitle}>
                      {this.getLengthTimecode(video.lengthInSeconds)} | {video.channel}
                    </Typography>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="remove"
                    onClick={() => this.props.socket.emit(Event.REMOVE_FROM_QUEUE, video.id)}
                  >
                    <img src={QueueDelete} alt="Delete" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider variant="fullWidth" component="li" className={classes.listDivider} />
            </React.Fragment>
          ))}

          <ListItem>
            <TextField
              error={error}
              InputProps={{
                className: classes.textField,
                startAdornment: (
                  <InputAdornment position="start">
                    <img src={QueueTextBoxIcon} width="20px" height="16px" style={{ margin: "3px" }} alt="Input"></img>
                  </InputAdornment>
                )
              }}
              InputLabelProps={{ className: classes.textField }}
              placeholder="Paste YouTube link here..."
              onChange={(event) => this.setState({ newVideoUrl: event.target.value })}
              onKeyDown={this.handleOnKeyDown}
              value={this.state.newVideoUrl}
              fullWidth
              style={{ margin: "15px 10px 15px 0px" }}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="add" onClick={this.requestAddToQueue}>
                <img src={QueueAdd} alt="Add" />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </div>
    );
  }
}

const styles = (theme: any) =>
  createStyles({
    container: {
      padding: "14px 20px",
      [theme.breakpoints.down("sm")]: {
        padding: "0px 20px"
      }
    },
    list: {
      color: "white"
    },
    textField: {
      color: "white",
      background: "rgba(255, 255, 255, 0.08)"
    },
    listTitle: {
      fontFamily: "Roboto, sans-serif",
      fontStyle: "normal",
      fontWeight: 500,
      fontSize: "24px",
      color: "rgba(255, 255, 255, 0.4)",
      maxHeight: 15,
      textTransform: "uppercase",
      marginLeft: "8px",
      marginBottom: "8px"
    },
    videoTitle: {
      color: "white",
      fontSize: "18px",
      [theme.breakpoints.down("sm")]: {
        fontSize: "14px"
      }
    },
    videoSubtitle: {
      color: "white",
      fontSize: "14px",
      [theme.breakpoints.down("sm")]: {
        display: "10px"
      }
    },
    listDivider: {
      "background-color": "rgba(255, 255, 255, 0.4)"
    },
    listNumber: {
      color: "white",
      fontSize: "22px",
      paddingRight: "25px",
      [theme.breakpoints.down("sm")]: {
        fontSize: "16px"
      }
    }
  });

export default withStyles(styles)(Queue);
