import React from "react";
import Peer from 'simple-peer';
import io from "socket.io-client";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import List from '@material-ui/core/List';
import { ListItem, ListItemText } from "@material-ui/core";
import { v1 as uuidv1 } from 'uuid';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Fade from "@material-ui/core/Fade";

interface VideoChatProps {
  classes: any,
  users: string[],
  socket: SocketIOClient.Socket,
}

interface VideoChatState {
  gotAnswer: boolean,
  stream: any,
  peer: any,
  peerVideo: any,
  inVideoChat: boolean,
  name: string,
  videoChatSet: string[],
  videoChatId: any,
  openInviteModal: boolean,
  inviteFrom: string,
  peerConnected: boolean,
  videoTrack: any,
  audioTrack: any,
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
    this.socket = this.props.socket
    this.state = {
      peerConnected: false,
      gotAnswer: false,
      stream: null,
      peer: null,
      peerVideo: null,
      inVideoChat: false,
      name: "",
      videoChatSet: [],
      videoChatId: null,
      openInviteModal: false,
      inviteFrom: '',
      videoTrack: null,
      audioTrack: null,
    };
    this.videoRef = React.createRef();
    this.peerVideoRef = React.createRef();
    this.createVideo = this.createVideo.bind(this);
    this.createVideo = this.createVideo.bind(this);
    this.makePeer = this.makePeer.bind(this);
    this.init = this.init.bind(this);
    this.setVideoChatSet = this.setVideoChatSet.bind(this);
    this.acceptVideoChatInvite = this.acceptVideoChatInvite.bind(this);
  }

  componentDidMount() {
    this.videoRef?.current?.addEventListener("ended", () => console.log('ended'));
    this.peerVideoRef?.current?.addEventListener("ended", () => console.log('ended'));
    this.socket.on('BackOffer', this.frontAnswer);
    this.socket.on('BackAnswer', this.signalAnswer); //if answer is from backend, handle, connect both clients
    this.socket.on('SessionActive', () => console.log('Session Active'));
    this.socket.on('CreatePeer', this.makePeer);
    this.socket.on('VIDEOCHAT_LIST', (data: string[]) => this.setVideoChatSet(data));
    this.socket.on('SEND_INVITE', (invite: any) => {
      this.openInviteModal(invite);
    })
    this.socket.on('ACCEPT_INVITE', (accept: any) => {
      this.sendVideoChatId(accept);
    })

    this.socket.on('SEND_VIDEOCHATID', (videoChatIdObj: any) => {
      this.setVideoChatId(videoChatIdObj.id);
    })

  }

  setInVideoChat = () => {
    this.setState({ inVideoChat: true });
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }) // this asks browser for permission to access cam/aud
      .then((stream) => {
        this.setState({ stream: stream });
        const node = this.videoRef.current;
        //TODO: Include id in this emit
        this.socket.emit('newVideoChatPeer', (this.state.videoChatId)); //handled in server.js
        if (node) {
          node.srcObject = stream;
        }

        this.setState({
          videoTrack: stream.getTracks()[1],
          audioTrack: stream.getTracks()[0]
        })
      })
      .catch(() => console.log('Permission Not Given'));//If permission not given, display error
  }

  stopMyVideoChat = () => {
    this.state.videoTrack.stop();
    this.state.audioTrack.stop();
    this.setState({
      videoTrack: null,
      audioTrack: null,
      inVideoChat: false,
      peerConnected: false,
      gotAnswer: false,
      stream: null,
      peer: null,
      peerVideo: null,
      videoChatSet: [],
      videoChatId: null,
      openInviteModal: false,
      inviteFrom: '',
    })
  }

  setVideoChatId = (id: any) => {
    this.setState({ videoChatId: id });
    this.socket.emit('VIDEO_CHAT', this.state.videoChatId);
    this.setInVideoChat();
  }

  sendVideoChatId = (accept: any) => {
    let videoChatId = uuidv1();
    let videoChatIdObj = { id: videoChatId, receiver: accept.sender };
    this.setVideoChatId(videoChatIdObj.id);
    this.socket.emit('SEND_VIDEOCHATID', videoChatIdObj);
  }

  openInviteModal = (invite: any) => {
    console.log('inviteFrom: ' + invite.sender);
    this.setState({ inviteFrom: invite.sender });
    this.setState({ openInviteModal: true });
  }

  sendInvite = (receiverId: string) => {
    let invite = { sender: this.socket.id, receiver: receiverId }
    this.socket.emit('SEND_INVITE', invite);
  }

  setVideoChatSet = (arr: string[]) => {
    // console.log('set: ' + set.entries(set));
    console.log('arr: ' + arr);
    this.setState({ videoChatSet: arr })
  }

  acceptVideoChatInvite = () => {
    // let invObj = { sentBy: this.state.name, to: name }
    let accept = { sender: this.socket.id, receiver: this.state.inviteFrom }
    this.socket.emit('ACCEPT_INVITE', accept);
    this.setState({ openInviteModal: false });
  }

  declineVideoChatInvite = () => {
    //TODO: Send an event that says declined?
    this.setState({ openInviteModal: false });
  }

  //Used to initialize a peer, define a new peer and return it
  init = (type: any): Peer.Instance => {//type tells us if init == true means sends offer, if init is false, wont send offer, wait for offer, send answer
    let socket = this.socket;
    let peer = new Peer({ initiator: (type === PeerTypes.init) ? true : false, stream: this.state.stream && this.state.stream, trickle: false });
    let copyThis = this;

    let peerNode = this.peerVideoRef.current;
    peer.on('stream', function (stream) {//when we get stream from other user, create new video
      copyThis.setState({ peerConnected: true });
      console.log('copythis.peerconnected: ' + copyThis.state.peerConnected);
      // // createVideo(stream)
      // const peerNode = this.peerVideoRef.current;
      if (peerNode) {
        peerNode.srcObject = stream
      }
    });
    peer.on('close', () => {//when peer is closed, destroy video
      alert('PEER CLOSED');
      copyThis.setState({ peerConnected: false });
      copyThis.setState({ inVideoChat: false });
      console.log('copythis.peerconnected: ' + copyThis.state.peerConnected);
      socket.emit('close');
      peer.destroy();//Everything is cleaned up,
    });

    peer.on('error', (err) => {
      // alert(err);
      copyThis.setState({ inVideoChat: false });
    })
    return peer;//Return our peer
  }


  //for peer of type init
  makePeer = (): void => {
    const gotAnswer = this.state.gotAnswer;
    let socket = this.socket;
    let videoChatId = this.state.videoChatId;
    let peer = this.init('init');
    peer.on('signal', function (data) {
      if (!gotAnswer) {
        //TODO: somehow include id in this emit offer
        let offerObj = { data: data, videoChatId: videoChatId };
        socket.emit('Offer', offerObj);
      }
    })
    this.setState({ peer: peer })
  }

  frontAnswer = (offer: any): void => {
    let peer = this.init('notInit');
    let socket = this.socket;
    let videoChatId = this.state.videoChatId;
    //this doesnt run automatically, have to call signal
    peer.on('signal', (data) => {
      //means we have gotten our offer
      //we want to imitate with even Answer
      //TODO: Include id in this emit
      let answerObj = { data: data, videoChatId: videoChatId };
      socket.emit('Answer', answerObj);
      // socket.emit('Answer', data);
    })
    //pass offer to signal, generate answer to backend, which will send to other user
    peer.signal(offer);
  }

  // handles when answer comes from backend
  // if answer comes from backend, set the client.gotAnswer to true, and signalAnswerView to peer, 
  // then finally both the clients will be connected
  signalAnswer = (answer: any): void => {
    this.setState({ gotAnswer: true })
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
    const { classes, users } = this.props;
    return (
      <React.Fragment>
        <h1>Video Chat</h1>
        {
          !this.state.inVideoChat &&
          <React.Fragment>
            <List component="nav">
              {Object.entries(users).map((user) => {
                if (user[1]) {
                  return (
                    <React.Fragment>
                      <ListItemText primary={user[1]} /> <button onClick={() => this.sendInvite(user[0])}>Video Chat</button>
                    </React.Fragment>
                  )
                }
              })}
            </List>
          </React.Fragment>
        }


        {this.state.inVideoChat &&
          <React.Fragment>
            <h1>Video Chat: + {this.state.videoChatId}</h1>
            <video ref={this.videoRef} autoPlay></video>
            <video ref={this.peerVideoRef} autoPlay></video>}
          </React.Fragment>
        }

        <button onClick={() => this.stopMyVideoChat()}>Off Video</button>

        <button>Leave VideoChat</button>

        <Modal
          disableAutoFocus={true}
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={this.state.openInviteModal}
          onClose={() => console.log('onClose modal')}
          closeAfterTransition
        >
          <Fade in={this.state.openInviteModal}>
            <div className={classes.paper}>
              <h1>Video Chat invite from {this.state.inviteFrom}</h1>
              <button onClick={this.acceptVideoChatInvite}>Accept</button>
              <button onClick={this.declineVideoChatInvite}>Decline</button>
            </div>
          </Fade>
        </Modal>
      </React.Fragment>
    );
  }
}

const materialUiStyles = {
  root: {
    background: "#000000",
    height: "292px",
    width: "212px",
    marginRight: "50px",
    marginLeft: "50px",
    border: "2px solid #051633",
    borderRadius: "10px",
    opacity: "1 !important"
  },
  textPrimary: {
    color: "white"
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    backgroundColor: "white",
    border: "1px solid #000",
    width: "905px",
    height: "400px",
    borderRadius: "20px",
    outline: "none"
  }
};

export default withStyles(materialUiStyles)(VideoChat);