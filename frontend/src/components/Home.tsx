import React from "react";
import Create from "./Create";
import Join from "./Join";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Link from "@material-ui/core/Link";
import { withStyles } from "@material-ui/core";
import logo from "../assets/logo.png";
import createIcon from "../assets/icon-create.svg";
import browseIcon from "../assets/icon-browse.svg";
import joinIcon from "../assets/icon-join.svg";
import bgVid from "../assets/background.mp4";
import "../styles/Home.css";

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
        <video autoPlay muted loop className="bgVid">
          {/* source: https://www.pexels.com/video/3570814/ */}
          <source src={bgVid} type="video/mp4" />
        </video>
        <div className="overlay">
          <div className="navContainer">
            <div className="navLeft">
              <Link href="/">
                <img className="logo" src={logo}></img>
              </Link>
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
          <Link href="/rooms">
            <Button classes={{ root: classes.root, textPrimary: classes.textPrimary }} color="primary">
              <div>
                <img src={browseIcon}></img>
                <div>Browse Rooms</div>
              </div>
            </Button>
          </Link>

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
              <div className={classes.paper}>
                <Join />
              </div>
            </Fade>
          </Modal>
          <div className="footer">
            <a href="https://www.netlify.com">
              <img src="https://www.netlify.com/img/global/badges/netlify-dark.svg" alt="Deploys by Netlify" />
            </a>
          </div>
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
