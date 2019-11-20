import React from 'react';
import { Link , Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import '../styles/HomePage.css';
import axios from 'axios';
import createSvg from '../images/icon_create.svg';
import discoverSvg from '../images/icon_discover.svg';
import joinSvg from '../images/icon_join.svg';
import refreshSvg from '../images/refresh-page-option.svg';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles, Theme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import JoinPage from './JoinPage';


interface State {
  roomid: string,
  redirect: boolean,
  openJoinModal: boolean,
}

const styles = {
  root: {
    background: '#000D2E',
    height: '292px',
    width: '212px',
    marginRight: '50px',
    marginLeft: '50px',
    border: '2px solid #051633',
    borderRadius: '10px',
  },
  textPrimary: {
    color: 'white',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: "white",
    border: '1px solid #000',
    width: '905px',
    height: '400px',
    borderRadius: '20px',
    outline: 'none',
  },
};

interface MyProps {
  
}



class HomePage extends React.Component<{classes: any}, State> {
  state = {
    roomid : "", 
    redirect : false,
    openJoinModal: false,
  }

  handleOpenJoinModal = () => {
    this.setState({
      openJoinModal: true,
    })
  }

  handleCloseJoinModal = () => {
    this.setState({
      openJoinModal: false,
    })
  }

  renderRedirect = () => {
    if(this.state.redirect){
      this.setState({redirect: false});
      return <Redirect to={{
        pathname: '/room',
        search: "?roomid=" + this.state.roomid,
      }} />
    }
  }

  createRoom = async() => {
    const res = await axios.post('http://localhost:8080/rooms', {})
    this.setState({roomid : res.data, redirect: true});
  }
  render = () => {
    const { classes } = this.props;
    return (
      <div className="App">
        <div className="navContainer">
          <div className="navLeft"><img className="iconHeight" src={refreshSvg}></img>Sync Along</div>
        </div>
        {/* <h1>Sync Along</h1> */}
        {this.renderRedirect()}
        <Button classes={{ root: classes.root, textPrimary: classes.textPrimary }} onClick={this.createRoom} color="primary"><div><img src={createSvg}></img><div>Create</div></div></Button>
        {/* <Button classes={{ root: classes.root, textPrimary: classes.textPrimary }} component={Link} to="/join" color="primary"><div><img src={joinSvg}></img><div>Join</div></div></Button> */}
        <Button classes={{ root: classes.root, textPrimary: classes.textPrimary }} onClick={this.handleOpenJoinModal} color="primary"><div><img src={joinSvg}></img><div>Join</div></div></Button>
        <Button classes={{ root: classes.root, textPrimary: classes.textPrimary }} component={Link} to="/rooms" color="primary"><div><img src={discoverSvg}></img><div>Discover</div></div></Button>

        <Modal
        disableAutoFocus={true}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={this.state.openJoinModal}
        onClose={this.handleCloseJoinModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={this.state.openJoinModal}>
          <div className={classes.paper}>
            <JoinPage/>
          </div>
        </Fade>
      </Modal>
      </div>
    );
  }
}



export default withStyles(styles)(HomePage);
