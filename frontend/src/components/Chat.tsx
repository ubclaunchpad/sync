import React, { FunctionComponent, useState, useEffect } from "react";

const styles = {
  chatBox: {
    border: "10px solid white",
    borderRadius: "20%",
    color: "white",
    maxWidth: "10vw",
    height: "50vh"
  }
};

interface Props {
  sendMessage: Function;
  signIn: Function;
}

interface State {
  message: string;
  signedIn: boolean;
}

class Chat extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      message: "",
      signedIn: false
    };
    this.onChange = this.onChange.bind(this);
    this.enterPressed = this.enterPressed.bind(this);
  }

  onChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({ message: event.currentTarget.value });
  };

  enterPressed = (event: React.KeyboardEvent) => {
    event.preventDefault();
    const code = event.keyCode || event.which;
    if (code === 13) {
      if (this.state.signedIn) {
        this.props.sendMessage(this.state.message);
      } else {
        this.props.signIn(this.state.message);
        if (this.state.message) {
          this.setState({ signedIn: true });
        }
      }
      this.setState({ message: "" });
    }
  };

  render() {
    const signInWindow = (
      <div>
        <input
          placeholder="What is your name?"
          onChange={this.onChange}
          onKeyUp={this.enterPressed}
          value={this.state.message}
        />
      </div>
    );
    const chatWindow = (
      <div>
        <input
          placeholder="Send a message"
          onChange={this.onChange}
          onKeyUp={this.enterPressed}
          value={this.state.message}
        />
      </div>
    );
    return (
      <div style={styles.chatBox}>
        <h3>Chat:</h3>
        {this.state.signedIn ? chatWindow : signInWindow}
      </div>
    );
  }
}

export default Chat;
