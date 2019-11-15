import React from 'react';
import YouTube from 'react-youtube';
import { ClientEvent } from '../api/constants';
import io from "socket.io-client";
import queryString from 'query-string';
import axios from 'axios';

class Room extends React.Component<{location: any}> {
  state = {
    socket : io.connect(ClientEvent.SERVER_URL),
    validRoomId: false,
    loaded: false,
    roomId: '',
  }

  async componentDidMount(){
    const socket = this.state.socket;
    socket.on('connect', () => {
      console.log('Lets sign up for a room');
       socket.emit('room', roomId);
     });
    let params = queryString.parse(this.props.location.search);
    let roomId = params['roomid'];
    let res = await axios.get("http://localhost:8080/rooms?roomid=" + roomId);
    if (res && res.data){
      this.setState({
        loaded: true,
        validRoomId: true,
        roomId: params['roomid'],
      })
    }
    else {
      this.setState({
        loaded: true,
      })
    }
  }

  handleOnPause = (event: { target: any, data: number }) => {
    const socket=this.state.socket;
    const roomId = this.state.roomId;
    socket.emit(ClientEvent.PAUSE + roomId, {data: "Pause!"});
  }

  handleOnPlay = (event: { target: any, data: number }) => {
     const socket = this.state.socket;
     const roomId = this.state.roomId;
     socket.emit(ClientEvent.PLAY + roomId, {data: "Play!"});
  }

  handleOnStateChange = (event: { target: any }) => {
    console.log('_onStateChange called');
  }

  //When the video player is ready, add listeners for play, pause etc
  handleOnReady = (event: { target: any; }) => {
    console.log('handleOnReady is ready');
    const socket=this.state.socket;
    const player = event.target;
    const roomId = this.state.roomId;

    const playCommand = ClientEvent.PLAY + roomId;
    console.log('playCommand: ' + playCommand);
    socket.on(ClientEvent.PLAY + roomId, (dataFromServer: any) => {
      console.log('Play is being sent from server');
      player.playVideo();
    });

    socket.on(ClientEvent.PAUSE + roomId, (dataFromServer: any) => {
      console.log(dataFromServer);
      player.pauseVideo();
    });
  }

  render() {
    let videoPlayer = this.state.loaded && this.state.validRoomId 
    ? <React.Fragment>
        <h1>Room {this.state.roomId}</h1>
        <YouTube 
          videoId={'HXcSGuYUkDg'}
          onReady={this.handleOnReady}
          onPlay={this.handleOnPlay}
          onStateChange={this.handleOnStateChange} 
          onPause={this.handleOnPause}
        />
      </React.Fragment> 
    : null;

    let invalidRoomId = this.state.loaded && !this.state.validRoomId 
    ? <h1>Invalid room id :(</h1> 
    : null;

    return (
    <div>
      {videoPlayer}
      {invalidRoomId}
    </div>
    );
  }
}

export default Room;