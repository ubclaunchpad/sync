import React from "react";
import { List, ListItem, ListItemText, TextField, ListItemSecondaryAction, IconButton } from "@material-ui/core";
import { createStyles, withStyles } from "@material-ui/core/styles";
import { Event } from "../sockets/event";
import AddIcon from "@material-ui/icons/Add";
import Video from "../models/video";

interface Props {
  classes: any;
  socket: SocketIOClient.Socket;
}

interface State {
  newVideoUrl: string;
  videos: Video[];
}

class Queue extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      newVideoUrl: "",
      videos: []
    };

    this.add = this.add.bind(this);
    this.requestAdd = this.requestAdd.bind(this);
  }

  requestAdd(videoUrl: string): void {
    this.props.socket.emit(Event.REQUEST_ADD_TO_QUEUE, videoUrl);
  }

  add(video: Video): void {
    const videos = this.state.videos;
    videos.push(video);

    this.setState({ videos });
  }

  componentDidMount() {
    this.props.socket.on(Event.ADD_TO_QUEUE, (video: Video) => this.add(video));
  }

  render() {
    const { classes } = this.props;

    return (
      <List component="nav" className={classes.list}>
        <ListItem>
          <TextField
            InputProps={{ className: classes.textField }}
            InputLabelProps={{ className: classes.textField }}
            label="YouTube URL"
            variant="outlined"
            onChange={event => this.setState({ newVideoUrl: event.target.value })}
          />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="comments" onClick={() => this.requestAdd(this.state.newVideoUrl)}>
              <AddIcon style={{ color: "white" }} />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        {this.state.videos.map((video, i) => (
          <ListItem key={i}>
            <ListItemText primary={video.title} />
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
  }
});

export default withStyles(materialUiStyles)(Queue);
