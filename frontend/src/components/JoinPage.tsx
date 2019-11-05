import React, {Component} from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

class Join extends Component {
  state = {
    roomId: '',
    redirect: false,
  }

  componentDidMount(){}

  setRedirect = () => {
    this.setState({
      redirect: true
    })
  }

  renderRedirect = () => {
    const { roomId, redirect } = this.state;
    const route = '/rooms' + '?roomid=' + roomId;
    if (redirect) {
      return <Redirect to={route} />
    }
  }

  getRoomId = (roomId : string) => {
    axios
      .get("http://localhost:8080/rooms?roomid=" + roomId)
      .then(data => data.data ? this.setRedirect() : alert('Enter a valid room id'))
      .catch(err => {
        console.log(err);
        return null;
      })
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