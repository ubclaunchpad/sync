import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { withStyles, createStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import Container from "@material-ui/core/Container";

interface Props {
  classes: any;
  changeUsernameAndEmit: any;
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
    event.preventDefault();
    const code = event.keyCode || event.which;
    if (code === 13) {
      this.props.changeUsernameAndEmit(this.state.username);
    }
  };

  handleCreateUsername() {
    this.props.changeUsernameAndEmit(this.state.username);
  }

  render() {
    const { classes } = this.props;
    return (
      <Container className={classes.container}>
        <Typography style={{ marginTop: "0.5em" }} align="center" variant="h5">
          Create Username
        </Typography>
        <div style={{ marginTop: "20px" }}>
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
          onClick={this.handleCreateUsername}
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
      color: "#FFFFFF"
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

export default withStyles(materialUiStyles)(Username);
