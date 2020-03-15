import React from "react";
import Paper from "@material-ui/core/Paper";
import { FileCopy, Facebook, Reddit, Twitter } from "@material-ui/icons";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
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
      <Paper className={classes.container}>
        {/*sharing to facebook only works when Url is a valid web url*/}
        <Tooltip title="Share to Facebook">
          <IconButton target="_blank" href={/*facebookURL*/ ""}>
            <Facebook></Facebook>
          </IconButton>
        </Tooltip>
        <Tooltip title="Share to Reddit">
          <IconButton target="_blank" href={redditURL}>
            <Reddit></Reddit>
          </IconButton>
        </Tooltip>
        <Tooltip title="Share to Twitter">
          <IconButton target="_blank" href={twitterURL}>
            <Twitter></Twitter>
          </IconButton>
        </Tooltip>
        <Tooltip title="Copy Room URL">
          <IconButton onClick={() => copy(this.props.roomUrl)}>
            <FileCopy></FileCopy>
          </IconButton>
        </Tooltip>
        <TextField
          className="link"
          inputProps={{ readOnly: true }}
          defaultValue={this.props.roomUrl}
          style={{ marginLeft: 10, paddingTop: 5, paddingBottom: -5, width: "33%" }}
        >
          {this.props.roomUrl}
        </TextField>
      </Paper>
    );
  }
}

const materialUiStyles = createStyles({
  container: {
    position: "relative",
    width: "33%",
    zIndex: 2,
    margin: "0 auto"
  }
});

export default withStyles(materialUiStyles)(Share);
