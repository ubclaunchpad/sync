import React from "react";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { withStyles, createStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";
import "../styles/Create.css";
import { Typography } from "@material-ui/core";
import Container from "@material-ui/core/Container";

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
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
    const match = this.state.url.match(regExp);
    if (match && match[2].length === 11) {
      const res = await axios.post(`${process.env.REACT_APP_API_URL || "http://localhost:8080"}/api/rooms`, {
        currVideoId: match[2],
        name: this.state.name,
        videoQueue: []
      });
      this.setState({ id: res.data, redirect: true });
    } else {
      this.setState({ errorMsg: "Invalid URL" });
    }
  }

  redirectIfRoomCreated() {
    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: "/rooms/" + this.state.id,
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
        <Typography style={{ marginTop: "0.5em" }} align="center" variant="h5">
          Create Room
        </Typography>
        <div style={{ marginTop: "20px" }}>
          <TextField
            onChange={this.handleNameFieldChange}
            onKeyUp={this.handleEnterPressed}
            id="outlined-basic"
            className={classes.textField}
            label="Room Name"
            margin="normal"
            variant="outlined"
            InputLabelProps={{
              className: classes.inputLabel
            }}
            InputProps={{
              className: classes.MuiInputBaseRoot
            }}
          />
          <TextField
            onChange={this.handleUrlFieldChange}
            onKeyUp={this.handleEnterPressed}
            id="outlined-basic"
            className={classes.textField}
            label="Video URL"
            margin="normal"
            variant="outlined"
            InputLabelProps={{
              className: classes.inputLabel
            }}
            InputProps={{
              className: classes.MuiInputBaseRoot
            }}
          />
          <TextField
            onChange={this.handleUsernameFieldChange}
            onKeyUp={this.handleEnterPressed}
            id="outlined-basic"
            className={classes.textField}
            label="Username (Optional)"
            margin="normal"
            variant="outlined"
            InputLabelProps={{
              className: classes.inputLabel
            }}
            InputProps={{
              className: classes.MuiInputBaseRoot
            }}
          />
        </div>
        {this.state.errorMsg ? <p style={{ color: "red" }}>{this.state.errorMsg}</p> : ""}
        <Button
          onClick={this.handleCreateRoom}
          variant="outlined"
          className={classes.button}
          style={{ marginTop: "35px" }}
        >
          Create
        </Button>
      </Container>
    );
  }
}

const materialUiStyles = createStyles({
  container: {
    textAlign: "center",
    color: "#FFFFFF"
  },
  textField: {
    marginLeft: "0",
    marginRight: "0",
    width: "500px",
    background: "rgba(255, 255, 255, 0.08)",
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "#FFFFFF",
        borderWidth: "2px",
        color: "#FFFFFF"
      }
    }
  },
  button: {
    background: "#FFFFFF",
    boxSizing: "border-box",
    borderRadius: "5px",
    color: "#001953",
    "&:hover": {
      backgroundColor: "#001953",
      color: "white"
    },
    marginTop: "100px",
    padding: "0.5em 2em"
  },
  input: {
    color: "#FFFFFF !important"
  },
  MuiInputBaseRoot: {
    color: "#FFFFFF"
  },
  inputLabel: {
    color: "#FFFFFF",
    "&.Mui-focused": {
      color: "#FFFFFF"
    }
  }
});

export default withStyles(materialUiStyles)(Create);
