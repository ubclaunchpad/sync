import React from "react";
import { List, ListItem, ListItemText, TextField, ListItemSecondaryAction, IconButton } from "@material-ui/core";
import { createStyles, withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import Video from "../models/video";
import Event from "../sockets/event";

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
  }

  setUpSocket(socket: SocketIOClient.Socket) {
    console.log("setting up sockets");
    socket.on(Event.ADD_VIDEO_TO_QUEUE_SUCCESS, () => {
      this.setState({ newVideoUrl: "", error: false });
      console.log("Hit ADD_VIDEO_TO_QUEUE_SUCCESS");
    });

    socket.on(Event.ADD_VIDEO_TO_QUEUE_ERROR, () => {
      this.setState({ error: true });
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <List component="nav" className={classes.list}>
        <ListItem>
          <TextField
            InputProps={{ className: this.state.error ? classes.textFieldError : classes.textField }}
            InputLabelProps={{ className: this.state.error ? classes.textFieldError : classes.textField }}
            label="YouTube URL"
            variant="outlined"
            onChange={event => this.setState({ newVideoUrl: event.target.value })}
            value={this.state.newVideoUrl}
          />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="add"
              onClick={() => {
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
                const match = this.state.newVideoUrl.match(regExp);
                if (match && match[2].length === 11) {
                  this.props.socket.emit(Event.REQUEST_ADD_TO_QUEUE, match[2]);
                } else {
                  this.setState({ error: true });
                }
              }}
            >
              <AddIcon style={{ color: "white" }} />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        {this.props.videos.map((video, i) => (
          <ListItem key={i}>
            <ListItemText primary={video.title} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="remove"
                onClick={() => this.props.socket.emit(Event.REMOVE_FROM_QUEUE, video.id)}
              >
                <RemoveIcon style={{ color: "white" }} />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    );
  }
}

const materialUiStyles = createStyles({
  list: {
    color: "white"
  },
  textField: {
    "& input + fieldset": {
      borderColor: "green !important",
      borderWidth: 2
    },
    color: "white"
  },
  textFieldError: {
    "& input + fieldset": {
      borderColor: "red !important",
      borderWidth: 2
    },
    color: "white"
  }
});

export default withStyles(materialUiStyles)(Queue);
