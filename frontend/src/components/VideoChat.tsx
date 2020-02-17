import React from "react";
import Peer from 'simple-peer';
import io from "socket.io-client";

interface VideoChatProps {
}

interface VideoChatState {
  gotAnswer: boolean,
  stream: any,
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
    };
    this.videoRef = React.createRef();
    this.peerVideoRef = React.createRef();
    // this.createVideo = this.createVideo.bind(this);
    // this.createVideoChat = this.createVideoChat.bind(this);
    // this.createVideo = this.createVideo.bind(this);
    // this.makePeer = this.makePeer.bind(this);
    // this.init = this.init.bind(this);
  }

  componentDidMount() {
    this.createVideoChat();

  }

  createVideoChat = () => {
    let client: Client = { gotAnswer: false, peer: null }
    let socket = this.socket;
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }) // this asks browser for permission to access cam/aud
      .then((stream) => {
        this.setState({ stream: stream });
        const node = this.videoRef.current;
        this.socket.emit('newVideoChatPeer'); //handled in server.js
        if (node) {
          node.srcObject = stream;
        }

        //Used to initialize a peer, define a new peer and return it
        const init = (type: any) => {//type tells us if init == true means sends offer, if init is false, wont send offer, wait for offer, send answer
          let peer = new Peer({ initiator: (type === PeerTypes.init) ? true : false, stream: this.state.stream && this.state.stream, trickle: false });
          peer.on('stream', function (stream) {//when we get stream from other user, create new video
            createVideo(stream)
          });
          peer.on('close', function () {//when peer is closed, destroy video
            peer.destroy();//Everything is cleaned up,
          });
          return peer;//Return our peer
        }


        //for peer of type init
        const makePeer = () => {
          console.log('makePeer called');
          let peer = init('init');
          peer.on('signal', function (data) {
            if (!client.gotAnswer) {
              socket.emit('Offer', data);
            }
          })
          client.peer = peer;
        }

        // Used when we get an offer from another client, we want to send him the answer
        // We'll have to define the peer, but it wont be of type notInit
        // for peer type of notInit
        const frontAnswer = (offer: any) => {
          let peer = init('notInit');
          //this doesnt run automatically, have to call signal
          peer.on('signal', (data) => {
            //means we have gotten our offer
            //we want to imitate with even Answer
            socket.emit('Answer', data);
          })
          //pass offer to signal, generate answer to backend, which will send to other user
          peer.signal(offer)
        }

        // handles when answer comes from backend
        // if answer comes from backend, set the client.gotAnswer to true, and signalAnswerView to peer, 
        // then finally both the clients will be connected
        const signalAnswer = (answer: any) => {
          client.gotAnswer = true;
          let peer = client.peer;
          peer.signal(answer)
        }


        const createVideo = (stream: any) => {
          const peerNode = this.peerVideoRef.current;
          if (peerNode) {
            peerNode.srcObject = stream
          }
        }

        this.socket.on('BackOffer', frontAnswer);
        this.socket.on('BackAnswer', signalAnswer); //if answer is from backend, handle, connect both clients
        this.socket.on('SessionActive', () => console.log('Session Active'));
        this.socket.on('CreatePeer', () => {
          makePeer();
        });
      })
      .catch();//If permission not given, display error 
  }

  render() {
    return (
      <React.Fragment>
        <h1>Test Video Chat</h1>
        <video ref={this.videoRef} autoPlay></video>
        <video ref={this.peerVideoRef} autoPlay></video>
      </React.Fragment>
    );
  }
}

export default VideoChat;