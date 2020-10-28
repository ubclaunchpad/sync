import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { withStyles } from "@material-ui/core/styles";
import styles from "../styles/Modal";

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
        <Typography style={{ fontFamily: "Libre Baskerville" }} align="center" variant="h4">
          Pick A Username
        </Typography>
        <div style={{ margin: "1.2em 0" }}>
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
        {this.state.errorMsg ? <p style={{ color: "red" }}>{this.state.errorMsg}</p> : ""}
        <Button
          onClick={this.handleCreateUsername}
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

export default withStyles(styles)(Username);
