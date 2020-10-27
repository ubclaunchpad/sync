import React from "react";
import Create from "./Create";
import Join from "./Join";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Grow from "@material-ui/core/Grow";
import Link from "@material-ui/core/Link";
import ParticlesBg from "particles-bg";
import { withStyles } from "@material-ui/core";
import logo from "../assets/logo.png";
import createIcon from "../assets/icon-create.svg";
import browseIcon from "../assets/icon-browse.svg";
import joinIcon from "../assets/icon-join.svg";
import styles from "../styles/Home";

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
      <div className={classes.home}>
        <ParticlesBg type="circle" bg={true} />
        <div className={classes.navContainer}>
          <Link href="/">
            <img className={classes.logo} src={logo} alt="Logo"></img>
          </Link>
        </div>
        <Button className={classes.btn} onClick={() => this.setState({ modal: ModalType.CREATE })} color="primary">
          <div>
            <img src={createIcon} alt="Create Icon"></img>
            <div>Create Room</div>
          </div>
        </Button>
        <Button className={classes.btn} onClick={() => this.setState({ modal: ModalType.JOIN })} color="primary">
          <div>
            <img src={joinIcon} alt="Join Icon"></img>
            <div>Join Room</div>
          </div>
        </Button>
        <Link href="/rooms" underline="none">
          <Button className={classes.btn} color="primary">
            <div>
              <img src={browseIcon} alt="Browse Icon"></img>
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
          <Grow in={this.state.modal === ModalType.CREATE}>
            <div className={classes.paper}>
              <Create />
            </div>
          </Grow>
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
          <Grow in={this.state.modal === ModalType.JOIN}>
            <div className={classes.paper}>
              <Join />
            </div>
          </Grow>
        </Modal>
        <div className={classes.footer}>
          <p>
            A{" "}
            <a href="https://ubclaunchpad.com" target="_blank" rel="noopener noreferrer">
              UBC Launch Pad
            </a>{" "}
            project. Powered by{" "}
            <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">
              Netlify.
            </a>
          </p>
        </div>
        <div className={classes.overlay}></div>
      </div>
    );
  }
}

export default withStyles(styles)(Home);
