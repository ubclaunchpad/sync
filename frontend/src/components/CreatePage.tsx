import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { withStyles, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = createStyles({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: '0',
    marginRight: '0',
    width: '500px',
  },
  button: {
    background: '#001953',
    boxSizing: 'border-box',
    borderRadius: '5px',
    color: 'white',
    "&:hover": {
      backgroundColor: "#001953"
    },
    marginTop: '100px',
    height: '60px',
    width: '260px',
  },
  input: {
    display: 'none',
  },
}) 

class Create extends React.Component<{classes: any}>{
  state = {
    roomId: '',
    roomName: '',
    url: '',
    redirect: false,
  }

  setRedirect = () => {
    this.setState({
      redirect: true
    })
  }

  renderRedirect = () => {
    const { roomId, redirect } = this.state;
    if (redirect) {
      return <Redirect to={{
        pathname: '/room',
        search: "?roomid=" + roomId,
        state: { 
          url: this.state.url,
          roomName: this.state.roomName,
         },
      }} />
    }
  }

  createRoom = async () => {
    const res = await axios.post('http://localhost:8080/rooms', {});
    this.setState({roomId : res.data});
    this.setRedirect();
  }

  handleSubmit = () => {
    this.createRoom();
  }

  handleOnChangeRoomName = (e: any) => {
    this.setState({roomName: e.target.value });
  }

  handleOnChangeUrl = (e: any) => {
    this.setState({url: e.target.value });
  }

  render() {
    const { classes } = this.props;
    const { roomId } = this.state;
    console.log('roomId: ' + roomId);
    return (
      <div style={{textAlign: "center"}}>
        {this.renderRedirect()}
        <h1>Create Room</h1>
          <div style={{marginTop: "20px"}}>
            <TextField
              onChange={this.handleOnChangeRoomName}
              id="outlined-basic"
              className={classes.textField}
              label="Room Name"
              margin="normal"
              variant="outlined"
            />
            <TextField
              onChange={this.handleOnChangeUrl}
              id="outlined-basic"
              className={classes.textField}
              label="Video URL"
              margin="normal"
              variant="outlined"
            />
          </div>
          <Button onClick={this.handleSubmit} variant="outlined" className={classes.button} style={{marginTop: "35px"}}>Submit</Button>
        </div>
    );
  }
}

export default withStyles(styles)(Create);