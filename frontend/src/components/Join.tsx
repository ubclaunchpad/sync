import React from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { withStyles, createStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

interface Props {
  classes: any;
}

interface State {
  id: string;
  redirect: boolean;
}

class Join extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      id: "",
      redirect: false
    };
    this.handleRoomIdFieldChange = this.handleRoomIdFieldChange.bind(this);
    this.handleJoinRoom = this.handleJoinRoom.bind(this);
    this.redirectIfRoomJoined = this.redirectIfRoomJoined.bind(this);
  }

  redirectIfRoomJoined() {
    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: "/rooms/" + this.state.id
          }}
        />
      );
    }
  }

  handleRoomIdFieldChange(e: any) {
    this.setState({ id: e.target.value });
  }

  handleJoinRoom() {
    this.setState({ redirect: true });
  }

  render() {
    const { classes } = this.props;
    return (
      <div style={{ textAlign: "center" }}>
        {this.redirectIfRoomJoined()}
        <h1>Join Room</h1>
        <div style={{ marginTop: "50px" }}>
          <TextField
            onChange={this.handleRoomIdFieldChange}
            id="outlined-basic"
            className={classes.textField}
            label="Room Id"
            margin="normal"
            variant="outlined"
          />
        </div>
        <Button onClick={this.handleJoinRoom} variant="outlined" className={classes.button}>
          Submit
        </Button>
      </div>
    );
  }
}

const materialUiStyles = createStyles({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: "0",
    marginRight: "0",
    width: "500px"
  },
  button: {
    background: "#001953",
    boxSizing: "border-box",
    borderRadius: "5px",
    color: "white",
    "&:hover": {
      backgroundColor: "#001953"
    },
    marginTop: "100px",
    height: "60px",
    width: "260px"
  },
  input: {
    display: "none"
  }
});

export default withStyles(materialUiStyles)(Join);
