import React from "react";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import Container from "@material-ui/core/Container";
import { Redirect } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import styles from "../styles/Modal";

interface Props {
  classes: any;
}

interface State {
  id: string;
  name: string;
  url: string;
  redirect: boolean;
  errorMsg: string;
  username: string;
}

class Create extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      url: "",
      redirect: false,
      errorMsg: "",
      username: ""
    };
    this.handleNameFieldChange = this.handleNameFieldChange.bind(this);
    this.handleUrlFieldChange = this.handleUrlFieldChange.bind(this);
    this.handleCreateRoom = this.handleCreateRoom.bind(this);
    this.redirectIfRoomCreated = this.redirectIfRoomCreated.bind(this);
    this.handleUsernameFieldChange = this.handleUsernameFieldChange.bind(this);
    this.handleEnterPressed = this.handleEnterPressed.bind(this);
  }

  handleNameFieldChange(e: any) {
    this.setState({ name: e.target.value });
  }

  handleUrlFieldChange(e: any) {
    this.setState({ url: e.target.value });
  }

  handleUsernameFieldChange(e: any) {
    this.setState({ username: e.target.value });
  }

  async handleCreateRoom() {
    // check if state.url leads to a YouTube video
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\?v=)([^#&?]*).*/;
    const match = this.state.url.match(regExp);
    if (match && match[2].length === 11) {
      const res = await axios.post(`${process.env.REACT_APP_API_URL || "http://localhost:8080"}/api/rooms`, {
        currVideoId: match[2],
        name: this.state.name
      });
      this.setState({ id: res.data, redirect: true });
    } else {
      this.setState({ errorMsg: "Enter a valid YouTube video URL" });
    }
  }

  redirectIfRoomCreated() {
    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: "/" + this.state.id,
            state: { username: this.state.username }
          }}
        />
      );
    }
  }

  handleEnterPressed = (event: React.KeyboardEvent) => {
    event.preventDefault();
    const code = event.keyCode || event.which;
    if (code === 13) {
      this.handleCreateRoom();
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <Container className={classes.container}>
        {this.redirectIfRoomCreated()}
        <Typography style={{ fontFamily: "Libre Baskerville" }} align="center" variant="h4">
          Create A Room
        </Typography>
        <div style={{ margin: "1.2em 0" }}>
          <TextField
            fullWidth
            onChange={this.handleNameFieldChange}
            onKeyUp={this.handleEnterPressed}
            className={classes.textField}
            label="Room Name"
            margin="normal"
            variant="outlined"
            InputLabelProps={{
              className: classes.inputLabel
            }}
            InputProps={{
              className: classes.input
            }}
          />
          <TextField
            fullWidth
            onChange={this.handleUrlFieldChange}
            onKeyUp={this.handleEnterPressed}
            className={classes.textField}
            label="YouTube Video URL"
            margin="normal"
            variant="outlined"
            InputLabelProps={{
              className: classes.inputLabel
            }}
            InputProps={{
              className: classes.input
            }}
          />
          <TextField
            fullWidth
            onChange={this.handleUsernameFieldChange}
            onKeyUp={this.handleEnterPressed}
            className={classes.textField}
            label="Username (optional)"
            margin="normal"
            variant="outlined"
            InputLabelProps={{
              className: classes.inputLabel
            }}
            InputProps={{
              className: classes.input
            }}
          />
        </div>
        <Button
          onClick={this.handleCreateRoom}
          variant="contained"
          className={classes.button}
          endIcon={<DoubleArrowIcon />}
          size="medium"
        >
          ENTER
        </Button>
        <Snackbar
          open={this.state.errorMsg !== ""}
          autoHideDuration={6000}
          onClose={() => {
            this.setState({ errorMsg: "" });
          }}
        >
          <Alert
            onClose={() => {
              this.setState({ errorMsg: "" });
            }}
            severity="error"
          >
            {this.state.errorMsg}
          </Alert>
        </Snackbar>
      </Container>
    );
  }
}

export default withStyles(styles)(Create);
