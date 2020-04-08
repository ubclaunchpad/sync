import React from "react";
import { Redirect } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { withStyles, createStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import "../styles/Create.css";
import { Typography } from "@material-ui/core";
import Container from "@material-ui/core/Container";

interface Props {
  classes: any;
}

interface State {
  id: string;
  redirect: boolean;
  username: string;
}

class Join extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      id: "",
      redirect: false,
      username: ""
    };
    this.handleRoomIdFieldChange = this.handleRoomIdFieldChange.bind(this);
    this.handleJoinRoom = this.handleJoinRoom.bind(this);
    this.redirectIfRoomJoined = this.redirectIfRoomJoined.bind(this);
    this.handleUsernameFieldChange = this.handleUsernameFieldChange.bind(this);
    this.handleEnterPressed = this.handleEnterPressed.bind(this);
  }

  redirectIfRoomJoined() {
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
      this.handleJoinRoom();
    }
  };

  handleRoomIdFieldChange(e: any) {
    this.setState({ id: e.target.value });
  }

  handleUsernameFieldChange(e: any) {
    this.setState({ username: e.target.value });
  }

  handleJoinRoom() {
    this.setState({ redirect: true });
  }

  render() {
    const { classes } = this.props;
    return (
      <Container className={classes.container}>
        {this.redirectIfRoomJoined()}
        <Typography style={{ marginTop: "0.5em" }} align="center" variant="h5">
          Join Room
        </Typography>
        <div style={{ marginTop: "50px" }}>
          <TextField
            onChange={this.handleRoomIdFieldChange}
            onKeyUp={this.handleEnterPressed}
            id="outlined-basic"
            className={classes.textField}
            label="Room Id"
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
        <Button onClick={this.handleJoinRoom} variant="outlined" className={classes.button}>
          Submit
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
      backgroundColor: "#001953"
    },
    marginTop: "75px",
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

export default withStyles(materialUiStyles)(Join);
