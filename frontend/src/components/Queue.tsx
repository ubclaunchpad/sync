import React from "react";
import { List, ListItem, ListItemText, TextField, ListItemSecondaryAction, IconButton } from "@material-ui/core";
import { createStyles, withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import Video from "../models/video";

interface Props {
  classes: any;
  onAddVideo: (youtubeId: string) => void;
  onRemoveVideo: (videoId: string) => void;
  videos: Video[];
}

interface State {
  newVideoUrl: string;
}

class Queue extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      newVideoUrl: ""
    };
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
            <IconButton
              edge="end"
              aria-label="add"
              onClick={() => {
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
                const match = this.state.newVideoUrl.match(regExp);
                if (match && match[2].length === 11) {
                  this.props.onAddVideo(match[2]);
                } else {
                  alert("Invalid URL");
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
              <IconButton edge="end" aria-label="remove" onClick={() => this.props.onRemoveVideo(video.id)}>
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
  }
});

export default withStyles(materialUiStyles)(Queue);
