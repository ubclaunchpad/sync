import React, { FunctionComponent, useState, useEffect } from "react";
import queryString from 'query-string';
import io from 'socket.io-client';
import { ReactComponent } from "*.svg";

const styles = {
  chatBox: {
    border: "10px solid white",
    "borderRadius": "20%",
    color: "white",
    "maxWidth": "10vw",
    height: "50vh",
  }
}


const display = {
  messages: []
}

type MessageProps = {
  message: string
}

const Message: FunctionComponent<MessageProps> = ({ message }) => <div>
  <p>{message}</p>
</div>

interface Props {
  sendMessage: Function,
  messages: Array<String>,
}

interface State {
  message: string
}

class Chat extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      message: "",
    }
    this.onChange = this.onChange.bind(this);
    this.enterPressed = this.enterPressed.bind(this);
  }

  onChange(event: React.FormEvent<HTMLInputElement>) {
    this.setState({ message: event.currentTarget.value });
  }

  enterPressed(event: React.KeyboardEvent) {
    event.preventDefault();
    var code = event.keyCode || event.which;
    if (code === 13) {
      this.props.sendMessage(this.state.message);
      this.setState({ message: "" });
    }

  }



  render() {
    return (
      <div style={styles.chatBox}>
        <h3>Chat:</h3>
        {display.messages}
        <input placeholder="Send a message"
          name="chatinput"
          onChange={this.onChange}
          onKeyUp={this.enterPressed}
          value={this.state.message}
        />
      </div>
    );
  }

}

export default Chat;


// useEffect(() => {
  //   // var { name, room } = queryString.parse(window.location.search);

  //   let socket = io(ENDPOINT);
  //   socket.emit('join', data, () => {
  //     alert("printing again");
  //   });

  //   return () => {
  //     socket.emit('disconnect');

  //     socket.off('disconnect');
  //   }
  // }, [ENDPOINT, window.location.search]);