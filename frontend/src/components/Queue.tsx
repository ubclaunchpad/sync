import React from "react";
import { List, ListItem, ListItemText, ListSubheader } from "@material-ui/core";
import { createStyles, withStyles } from "@material-ui/core/styles";
import { Event } from "../sockets/event";

interface Video {
  name: string;
  url: string;
}

interface Props {
  classes: any;
  socket: SocketIOClient.Socket;
}

interface State {
  videos: Video[];
}

class Queue extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      videos: []
    };

    this.addVideo = this.addVideo.bind(this);
    this.handleAddVideo = this.handleAddVideo.bind(this);
  }

  handleAddVideo(): void {
    debugger;
    this.addVideo();
    this.props.socket.emit(Event.ADD_TO_QUEUE);
  }

  addVideo(): void {
    debugger;
    const videos = this.state.videos;
    const newVideo = { name: "Test Video", url: "https://youtube.com" };
    videos.push(newVideo);

    this.setState({ videos });
  }

  componentDidMount() {
    debugger;
    this.props.socket.on(Event.ADD_TO_QUEUE, this.addVideo);
  }

  render() {
    const { classes } = this.props;

    return (
      <List component="nav" className={classes.list}>
        {this.state.videos.map(video => (
          <ListItem>
            <ListItemText primary={video.name} />
          </ListItem>
        ))}
        <ListItem button onClick={this.handleAddVideo}>
          <ListItemText primary="Add video" />
        </ListItem>
      </List>
    );
  }
}

const materialUiStyles = createStyles({
  list: {
    color: "white"
  }
});

export default withStyles(materialUiStyles)(Queue);
