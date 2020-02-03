import React from "react";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { withStyles, createStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";

interface Props {
  classes: any;
}

interface State {
  id: string;
  name: string;
  url: string;
  redirect: boolean;
}

class Create extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      url: "",
      redirect: false
    };
    this.handleNameFieldChange = this.handleNameFieldChange.bind(this);
    this.handleUrlFieldChange = this.handleUrlFieldChange.bind(this);
    this.handleCreateRoom = this.handleCreateRoom.bind(this);
    this.redirectIfRoomCreated = this.redirectIfRoomCreated.bind(this);
  }

  handleNameFieldChange(e: any) {
    this.setState({ name: e.target.value });
  }

  handleUrlFieldChange(e: any) {
    this.setState({ url: e.target.value });
  }

  async handleCreateRoom() {
    const res = await axios.post("http://localhost:8080/rooms", {
      url: this.state.url,
      name: this.state.name
    });
    this.setState({ id: res.data, redirect: true });
  }

  redirectIfRoomCreated() {
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

  render() {
    const { classes } = this.props;
    return (
      <div style={{ textAlign: "center" }}>
        {this.redirectIfRoomCreated()}
        <h1>Create Room</h1>
        <div style={{ marginTop: "20px" }}>
          <TextField
            onChange={this.handleNameFieldChange}
            id="outlined-basic"
            className={classes.textField}
            label="Room Name"
            margin="normal"
            variant="outlined"
          />
          <TextField
            onChange={this.handleUrlFieldChange}
            id="outlined-basic"
            className={classes.textField}
            label="Video URL"
            margin="normal"
            variant="outlined"
          />
        </div>
        <Button
          onClick={this.handleCreateRoom}
          variant="outlined"
          className={classes.button}
          style={{ marginTop: "35px" }}
        >
          Create
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

export default withStyles(materialUiStyles)(Create);
