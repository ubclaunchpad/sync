import React from "react";
import { List, ListItem, ListItemText, TextField, ListItemSecondaryAction, IconButton } from "@material-ui/core";
import { createStyles, withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import Video from "../models/video";

interface Props {
  classes: any;
  onAddVideo: (url: string) => void;
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
            <IconButton edge="end" aria-label="comments" onClick={() => this.props.onAddVideo(this.state.newVideoUrl)}>
              <AddIcon style={{ color: "white" }} />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        {this.props.videos.map((video, i) => (
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
