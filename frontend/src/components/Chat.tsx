import React from "react";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import TextField from "@material-ui/core/TextField";
import { Message } from "../models";
import ScrollableFeed from "react-scrollable-feed";
import { createStyles, withStyles } from "@material-ui/core/styles";

interface Props {
  classes: any;
  sendMessage: Function;
  messages: Message[];
  username: string;
}

interface State {
  message: string;
}

class Chat extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      message: ""
    };
  }

  onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ message: event.currentTarget.value });
  };

  enterPressed = (event: React.KeyboardEvent) => {
    event.preventDefault();
    const code = event.keyCode || event.which;
    if (code === 13) {
      if (this.state.message) {
        this.props.sendMessage(this.state.message);
      }
      this.setState({ message: "" });
    }
  };

  renderMsgs = (classes: any) => {
    const msgs = [];

    for (let i = 0; i < this.props.messages.length; i++) {
      msgs.push(
        <ListItemText
          key={i}
          className={classes.message}
          primary={
            <span>
              <div style={{ paddingLeft: "15px" }}>
                <span className={classes.username}>
                  {this.props.messages[i].user ? this.props.messages[i].user + ": " : ""}
                </span>
                {this.props.messages[i].message}
              </div>
            </span>
          }
        />
      );
    }

    if (this.props.messages.length > 0) {
      return <List>{msgs}</List>;
    } else {
      return "";
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <Card className={classes.chatContainer}>
        <CardHeader
          classes={{
            title: classes.chatHeader
          }}
          title="CHAT"
        />
        <ScrollableFeed forceScroll className={classes.messages}>
          {this.renderMsgs(classes)}
        </ScrollableFeed>
        <div className={classes.textboxContainer}>
          <TextField
            fullWidth
            InputProps={{ className: classes.textField, disableUnderline: true }}
            InputLabelProps={{ className: classes.usernameLabel }}
            label={this.props.username + ":"}
            placeholder="Type your message..."
            onChange={this.onChange}
            onKeyUp={this.enterPressed}
            value={this.state.message}
            variant="filled"
          />
        </div>
      </Card>
    );
  }
}

const styles = createStyles({
  chatContainer: {
    position: "relative",
    height: "50vh",
    background: "rgba(255, 255, 255, 0.05)",
    margin: "0px 20px"
  },
  chatHeader: {
    fontWeight: 500,
    fontSize: "24px",
    color: "rgba(255, 255, 255, 0.4)",
    maxHeight: 15
  },
  textboxContainer: {
    position: "absolute",
    bottom: "0",
    width: "100%"
  },
  textField: {
    borderRadius: "0px",
    color: "rgba(225, 225, 225, 0.8)",
    backgroundColor: "rgba(0, 0, 0, 0.15)"
  },
  usernameLabel: {
    fontSize: 18,
    color: "rgba(98, 239, 249, 0.8)",
    "&.Mui-focused": {
      color: "rgba(0, 159, 255, 0.8)"
    }
  },
  username: {
    color: "rgba(98, 239, 249, 0.8)",
    fontWeight: 420,
    fontSize: 18
  },
  message: {
    fontSize: 18,
    color: "rgba(225, 225, 225, 0.8)"
  },
  messages: {
    overflowX: "auto",
    overflowWrap: "break-word",
    height: "80%",
    "&::-webkit-scrollbar": {
      width: "0.5em"
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: 1
    }
  }
});

export default withStyles(styles)(Chat);
