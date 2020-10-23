import React from "react";
import { Redirect } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import styles from "../styles/Modal";

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
        <Typography style={{ fontFamily: "Libre Baskerville" }} align="center" variant="h4">
          Join A Room
        </Typography>
        <div style={{ margin: "1.2em 0" }}>
          <TextField
            fullWidth
            onChange={this.handleRoomIdFieldChange}
            onKeyUp={this.handleEnterPressed}
            className={classes.textField}
            label="Room ID"
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
          onClick={this.handleJoinRoom}
          variant="contained"
          className={classes.button}
          endIcon={<DoubleArrowIcon />}
          size="medium"
        >
          ENTER
        </Button>
      </Container>
    );
  }
}

export default withStyles(styles)(Join);
