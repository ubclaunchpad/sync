import React from "react";
import Paper from "@material-ui/core/Paper";
import { FileCopy, Facebook, Reddit, Twitter } from "@material-ui/icons";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, withStyles } from "@material-ui/core/styles";
import copy from "clipboard-copy";

interface Props {
  roomUrl: string;
  classes: any;
}

interface State {
  message: string;
}

class Share extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const shareText = "Come+join+my+Sync+viewing+party!";
    const redditURL = `https://www.reddit.com/submit?url=${this.props.roomUrl}&title=${shareText}`;
    const facebookURL = `https://www.facebook.com/sharer/sharer.php?u=${this.props.roomUrl}`;
    const twitterURL = `https://twitter.com/intent/tweet?text=${shareText + "%0D" + this.props.roomUrl}`;
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Tooltip title="Share to Facebook">
          <IconButton target="_blank" href={facebookURL}>
            <Facebook style={{ color: "rgb(33, 120, 232)" }}></Facebook>
          </IconButton>
        </Tooltip>
        <Tooltip title="Share to Reddit">
          <IconButton target="_blank" href={redditURL}>
            <Reddit style={{ color: "rgb(246, 69, 29)" }}></Reddit>
          </IconButton>
        </Tooltip>
        <Tooltip title="Share to Twitter">
          <IconButton target="_blank" href={twitterURL}>
            <Twitter style={{ color: "rgb(41, 159, 232)" }}></Twitter>
          </IconButton>
        </Tooltip>
        <Tooltip title="Copy Room URL">
          <IconButton onClick={() => copy(this.props.roomUrl)}>
            <FileCopy style={{ color: "rgb(246, 246, 246)" }}></FileCopy>
          </IconButton>
        </Tooltip>
      </React.Fragment>
    );
  }
}

const materialUiStyles = createStyles({
  container: {
    display: "inline-flex",
    justifyContent: "center",
    position: "relative",
    width: "100%",
    zIndex: 2,
    margin: "auto"
  }
});

export default withStyles(materialUiStyles)(Share);
