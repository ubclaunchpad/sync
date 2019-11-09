import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

class Join extends React.Component{
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
    return (
    <div>
      {this.renderRedirect()}
      <h1>Join Page</h1>
        Room id: <input onChange={this.handleOnChange} type="text" name="roomid"></input>
        <button onClick={this.handleSubmit} >Submit</button>
    </div>);
  }
}

export default Join;