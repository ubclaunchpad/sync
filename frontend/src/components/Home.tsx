import React from "react";
import { Link } from "react-router-dom";
import Create from "./Create";
import Join from "./Join";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { withStyles } from "@material-ui/core";
import logo from "../images/logo.png";
import createIcon from "../images/icon-create.svg";
import browseIcon from "../images/icon-browse.svg";
import joinIcon from "../images/icon-join.svg";
import "../styles/Home.css";
import Typography from "@material-ui/core/Typography";

enum ModalType {
  NONE = 0,
  JOIN = 1,
  CREATE = 2
}

interface Props {
  classes: any;
}

interface State {
  modal: ModalType;
}

class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      modal: ModalType.NONE
    };
  }

  render() {
    const { classes } = this.props;
    return (
      <div className="home">
        <div className="overlay">
          <div className="navContainer">
            <div className="navLeft">
              <img className="logo" src={logo}></img>
            </div>
          </div>

          <Button
            classes={{ root: classes.root, textPrimary: classes.textPrimary }}
            onClick={() => this.setState({ modal: ModalType.CREATE })}
            color="primary"
          >
            <div>
              <img src={createIcon}></img>
              <div>Create Room</div>
            </div>
          </Button>
          <Button
            classes={{ root: classes.root, textPrimary: classes.textPrimary }}
            onClick={() => this.setState({ modal: ModalType.JOIN })}
            color="primary"
          >
            <div>
              <img src={joinIcon}></img>
              <div>Join Room</div>
            </div>
          </Button>
          <Button
            classes={{ root: classes.root, textPrimary: classes.textPrimary }}
            component={Link}
            to="/rooms"
            color="primary"
          >
            <div>
              <img src={browseIcon}></img>
              <div>Browse Rooms</div>
            </div>
          </Button>

          <Modal
            disableAutoFocus={true}
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={this.state.modal === ModalType.CREATE}
            onClose={() => this.setState({ modal: ModalType.NONE })}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500
            }}
          >
            <Fade in={this.state.modal === ModalType.CREATE}>
              <div className={classes.paper}>
                <Create />
              </div>
            </Fade>
          </Modal>

          <Modal
            disableAutoFocus={true}
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={this.state.modal === ModalType.JOIN}
            onClose={() => this.setState({ modal: ModalType.NONE })}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500
            }}
          >
            <Fade in={this.state.modal === ModalType.JOIN}>
              <div>
                <Join />
              </div>
            </Fade>
          </Modal>
        </div>
      </div>
    );
  }
}

const materialUiStyles = {
  root: {
    background: "#000000",
    height: "292px",
    width: "212px",
    marginRight: "50px",
    marginLeft: "50px",
    border: "2px solid #051633",
    borderRadius: "10px",
    opacity: "1 !important"
  },
  textPrimary: {
    color: "white"
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    background: "rgba(34,34,34,0.99)",
    border: "1px solid #000",
    maxWidth: "700px",
    height: "400px",
    borderRadius: "20px",
    outline: "none",
    padding: "2em"
  }
};

export default withStyles(materialUiStyles)(Home);
