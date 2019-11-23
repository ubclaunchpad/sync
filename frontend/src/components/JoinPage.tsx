import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
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

class Join extends React.Component<{classes: any}>{
  state = {
    roomId: '',
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
      }} />
    }
  }

  getRoomId = async (roomId: string) => {
    let res = await axios.get("http://localhost:8080/rooms?roomid=" + roomId);
    if (res && res.data){
      console.log('roomId exists');
      this.setRedirect();
    }
    else {
      alert('Room does not exist :(');
    }
  };

  handleSubmit = () => {
    const { roomId } = this.state;
    this.getRoomId(roomId);
  }

  handleOnChange = (e: any) => {
    this.setState({roomId: e.target.value });
  }

  render() {
    const { classes } = this.props;
    const { roomId } = this.state;
    console.log('roomId: ' + roomId);
    return (
      <div style={{textAlign: "center"}}>
        {this.renderRedirect()}
        <h1>Join Room</h1>
          <div style={{marginTop: "50px"}}>
            <TextField
              onChange={this.handleOnChange}
              id="outlined-basic"
              className={classes.textField}
              label="Room Id"
              margin="normal"
              variant="outlined"
            />
          </div>
          <Button onClick={this.handleSubmit} variant="outlined" className={classes.button}>Submit</Button>
        </div>
    );
  }
}

export default withStyles(styles)(Join);