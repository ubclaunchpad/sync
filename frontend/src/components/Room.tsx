import React from 'react';
import YouTube from 'react-youtube';
import { ClientEvent } from '../api/constants';
import io from "socket.io-client";
import queryString from 'query-string';
import axios from 'axios';

interface DataFromServer {
  msg: string,
}

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
       socket.emit(ClientEvent.JOIN_ROOM, roomId);
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
    console.log('State has changed');
  }

  //When the video player is ready, add listeners for play, pause etc
  handleOnReady = (event: { target: any; }) => {
    const socket=this.state.socket;
    const player = event.target;
    const roomId = this.state.roomId;

    socket.on(ClientEvent.PLAY + roomId, (dataFromServer: DataFromServer) => {
      console.log(dataFromServer.msg);
      player.playVideo();
    });

    socket.on(ClientEvent.PAUSE + roomId, (dataFromServer: DataFromServer) => {
      console.log(dataFromServer.msg);
      player.pauseVideo();
    });

    socket.on(ClientEvent.MESSAGE, (dataFromServer: DataFromServer) => {
      console.log( dataFromServer.msg);
    })
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