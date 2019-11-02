import React, {Component} from 'react';
import YouTube from 'react-youtube';
import { ClientEvent } from '../api/constants';
import io from "socket.io-client";

class Rooms extends Component {
  state = {
    socket : io.connect(ClientEvent.SERVER_URL),
  }

  componentDidMount(){
    const socket = this.state.socket;
    socket.on(ClientEvent.CONNECT, () => {
      console.log(socket.id);
      console.log('Connected to socketio sever');
    });
  }

  //When pause button is pressed, emit an event to socketio server
  handleOnPause = (event: { target: any, data: number }) => {
    const socket=this.state.socket;
    socket.emit(ClientEvent.PAUSE, {data: "Pause!"});
  }

  //When play button is pressed, emit an event to socketio server
  handleOnPlay = (event: { target: any, data: number }) => {
     const socket = this.state.socket;
     socket.emit(ClientEvent.PLAY, {data: "Play!"});
  }

  //When video player state changes, call this function
  handleOnStateChange = (event: { target: any }) => {
    console.log('_onStateChange called');
  }

  //When the video player is ready, add listeners for play, pause etc
  handleOnReady = (event: { target: any; }) => {
    const socket=this.state.socket;
    const player = event.target;

    socket.on(ClientEvent.PLAY, (dataFromServer: any) => {
      console.log(dataFromServer);
      player.playVideo();
    });

    socket.on(ClientEvent.PAUSE, (dataFromServer: any) => {
      console.log(dataFromServer);
      player.pauseVideo();
    });
  }

  render() {
    return (
    <div>
      <h1>Rooms</h1>
      <YouTube 
        videoId={'HXcSGuYUkDg'}
        onReady={this.handleOnReady}
        onPlay={this.handleOnPlay}
        onStateChange={this.handleOnStateChange} 
        onPause={this.handleOnPause}
      />
    </div>);
  }
}

export default Rooms;