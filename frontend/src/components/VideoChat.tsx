import React from "react";

interface VideoChatProps {
}

interface VideoChatState {
}

class VideoChat extends React.Component<VideoChatProps, VideoChatState> {
  private videoRef: React.RefObject<HTMLVideoElement>;

  constructor(props: VideoChatProps) {
    super(props);
    this.state = {
    };
    this.videoRef = React.createRef();
  }

  componentDidMount() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }) // this asks browser for permission to access cam/aud
      .then((stream) => {
        const node = this.videoRef.current;
        if (node) {
          node.srcObject = stream;
        }
      })
      .catch();//If permission not given, display error 
  }

  render() {

    return (
      <React.Fragment>
        <h1>Test Video Chat</h1>
        <video ref={this.videoRef} autoPlay></video>
      </React.Fragment>
    );
  }
}

export default VideoChat;