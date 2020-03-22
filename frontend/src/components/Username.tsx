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
  errorMsg: string;
  username: string;
}

class Username extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      errorMsg: "",
      username: ""
    };

    this.handleUsernameFieldChange = this.handleUsernameFieldChange.bind(this);
    this.handleEnterPressed = this.handleEnterPressed.bind(this);
    this.handleCreateUsername = this.handleCreateUsername.bind(this);
  }

  handleUsernameFieldChange(e: any) {
    this.setState({ username: e.target.value });
  }

  handleEnterPressed = (event: React.KeyboardEvent) => {
    // TODO?
    console.log("motherufuckerbithc");
  };

  handleCreateUsername() {
    // TODO
  }

  render() {
    const { classes } = this.props;
    return (
      <div style={{ textAlign: "center" }}>
        <h1>Create Username</h1>
        <div style={{ marginTop: "20px" }}>
          <TextField
            onChange={this.handleUsernameFieldChange}
            onKeyUp={this.handleEnterPressed}
            id="outlined-basic"
            className={classes.textField}
            label="Username (Optional)"
            margin="normal"
            variant="outlined"
          />
        </div>
        {this.state.errorMsg ? <p style={{ color: "red" }}>{this.state.errorMsg}</p> : ""}
        <Button
          onClick={this.handleCreateUsername}
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

export default withStyles(materialUiStyles)(Username);
