import React from "react";
import Peer from 'simple-peer';
import io from "socket.io-client";

interface VideoChatProps {
}

interface VideoChatState {
  gotAnswer: boolean,
  stream: any,
  peer: any,
  peerVideo: any,
  startVideo: boolean,
}

interface PeerType {
  init: 'init',
  notInit: 'notInit',
}

enum PeerTypes {
  init = 'init',
  notInit = 'notInit',
}

interface Client {
  gotAnswer: any,
  peer: any,
}

class VideoChat extends React.Component<VideoChatProps, VideoChatState> {
  private videoRef: React.RefObject<HTMLVideoElement>;
  private peerVideoRef: React.RefObject<HTMLVideoElement>;
  private socket: SocketIOClient.Socket;

  constructor(props: VideoChatProps) {
    super(props);
    this.socket = io.connect("http://localhost:8080/");
    this.state = {
      gotAnswer: false,
      stream: null,
      peer: null,
      peerVideo: null,
      startVideo: false,
    };
    this.videoRef = React.createRef();
    this.peerVideoRef = React.createRef();
    this.createVideo = this.createVideo.bind(this);
    this.createVideo = this.createVideo.bind(this);
    this.makePeer = this.makePeer.bind(this);
    this.init = this.init.bind(this);
  }

  componentDidMount() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }) // this asks browser for permission to access cam/aud
      .then((stream) => {
        this.setState({ stream: stream });
        const node = this.videoRef.current;
        this.socket.emit('newVideoChatPeer'); //handled in server.js
        if (node) {
          node.srcObject = stream;
        }
      })
      .catch();//If permission not given, display error

    this.socket.on('BackOffer', this.frontAnswer);
    this.socket.on('BackAnswer', this.signalAnswer); //if answer is from backend, handle, connect both clients
    this.socket.on('SessionActive', () => console.log('Session Active'));
    this.socket.on('CreatePeer', this.makePeer);

  }

  //Used to initialize a peer, define a new peer and return it
  init = (type: any): Peer.Instance => {//type tells us if init == true means sends offer, if init is false, wont send offer, wait for offer, send answer
    let socket = this.socket;
    let peer = new Peer({ initiator: (type === PeerTypes.init) ? true : false, stream: this.state.stream && this.state.stream, trickle: false });

    let peerNode = this.peerVideoRef.current;
    peer.on('stream', function (stream) {//when we get stream from other user, create new video
      // // createVideo(stream)
      // const peerNode = this.peerVideoRef.current;
      if (peerNode) {
        peerNode.srcObject = stream
      }
    });
    peer.on('close', function () {//when peer is closed, destroy video
      socket.emit('close');
      peer.destroy();//Everything is cleaned up,
    });
    return peer;//Return our peer
  }


  //for peer of type init
  makePeer = (): void => {
    const gotAnswer = this.state.gotAnswer;
    let socket = this.socket;
    let peer = this.init('init');
    peer.on('signal', function (data) {
      if (!gotAnswer) {
        socket.emit('Offer', data);
      }
    })
    this.setState({ peer: peer })
  }

  frontAnswer = (offer: any): void => {
    let peer = this.init('notInit');
    let socket = this.socket;
    //this doesnt run automatically, have to call signal
    peer.on('signal', (data) => {
      //means we have gotten our offer
      //we want to imitate with even Answer
      socket.emit('Answer', data);
    })
    //pass offer to signal, generate answer to backend, which will send to other user
    peer.signal(offer);
  }

  // handles when answer comes from backend
  // if answer comes from backend, set the client.gotAnswer to true, and signalAnswerView to peer, 
  // then finally both the clients will be connected
  signalAnswer = (answer: any): void => {
    this.setState({ gotAnswer: true })
    // client.gotAnswer = true;
    // let peer = client.peer;
    let peer = this.state.peer;
    peer.signal(answer);
  }

  createVideo = (stream: any): void => {
    const peerNode = this.peerVideoRef.current;
    if (peerNode) {
      peerNode.srcObject = stream
      this.setState({ peerVideo: stream });
    }
  }

  render() {
    return (
      <React.Fragment>
        <h1>Test Video Chat</h1>
        <video ref={this.videoRef} autoPlay></video>
        {<video ref={this.peerVideoRef} autoPlay></video>}
        <button onClick={() => this.setState({ startVideo: true })}>Start</button>
        <button onClick={() => this.setState({ startVideo: false })}>End</button>
      </React.Fragment>
    );
  }
}

export default VideoChat;