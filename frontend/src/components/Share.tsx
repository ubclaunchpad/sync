import React from "react";
import { FileCopy, Facebook, Reddit, Twitter } from "@material-ui/icons";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import copy from "clipboard-copy";

interface Props {
  roomUrl: string;
  width: "xs" | "sm" | "md" | "lg" | "xl";
}

interface State {
  message: string;
}

class Share extends React.Component<Props, State> {
  render() {
    const shareText = "Come+join+my+Sync+viewing+party!";
    const redditURL = `https://www.reddit.com/submit?url=${this.props.roomUrl}&title=${shareText}`;
    const facebookURL = `https://www.facebook.com/sharer/sharer.php?u=${this.props.roomUrl}`;
    const twitterURL = `https://twitter.com/intent/tweet?text=${shareText + "%0D" + this.props.roomUrl}`;

    let size: "small" | "medium" | undefined = "small";
    if (isWidthUp("sm", this.props.width)) {
      size = "medium";
    }

    return (
      <React.Fragment>
        <Tooltip title="Share to Facebook">
          <IconButton size={size} target="_blank" href={facebookURL}>
            <Facebook style={{ color: "rgb(33, 120, 232)" }}></Facebook>
          </IconButton>
        </Tooltip>
        <Tooltip title="Share to Twitter">
          <IconButton size={size} target="_blank" href={twitterURL}>
            <Twitter style={{ color: "rgb(41, 159, 232)" }}></Twitter>
          </IconButton>
        </Tooltip>
        <Tooltip title="Share to Reddit">
          <IconButton size={size} target="_blank" href={redditURL}>
            <Reddit style={{ color: "rgb(246, 69, 29)" }}></Reddit>
          </IconButton>
        </Tooltip>
        <Tooltip title="Copy Room URL">
          <IconButton size={size} onClick={() => copy(this.props.roomUrl)}>
            <FileCopy style={{ color: "rgb(246, 246, 246)" }}></FileCopy>
          </IconButton>
        </Tooltip>
      </React.Fragment>
    );
  }
}

export default withWidth()(Share);
