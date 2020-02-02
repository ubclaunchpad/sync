import React from "react";
import { List, ListItem, ListItemText, TextField, ListItemSecondaryAction, IconButton } from "@material-ui/core";
import { createStyles, withStyles } from "@material-ui/core/styles";
import { Event } from "../sockets/event";
import AddIcon from "@material-ui/icons/Add";

interface Video {
  name: string;
  url: string;
}

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
    debugger;
    this.props.socket.emit(Event.REQUEST_ADD_TO_QUEUE, videoUrl);
  }

  add(title: string): void {
    debugger;
    console.log("Adding a video");
    const videos = this.state.videos;
    const newVideo = { name: title, url: "https://youtube.com" };
    videos.push(newVideo);

    this.setState({ videos });
  }

  componentDidMount() {
    debugger;
    this.props.socket.on(Event.ADD_TO_QUEUE, (title: string) => this.add(title));
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
            <ListItemText primary={video.name} />
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
