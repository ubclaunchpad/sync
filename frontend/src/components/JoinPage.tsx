import React, {Component} from 'react';
import axios from 'axios';

class Join extends Component {
  state = {
    roomId: '',
  }

  componentDidMount(){
  }

  getRoomId = () => {
    axios
      .get("http://localhost:8080/rooms?roomid=bee3c2f0-fec9-11e9-929b-cf04f489342f")
      .then(data => console.log('DATA: ' + JSON.stringify(data)))
      .catch(err => {
        console.log(err);
        return null;
      })
  };

  handleSubmit = () => {
    console.log(this.state.roomId);
    this.getRoomId();
  }

  handleOnChange = (e: any) => {
    this.setState({roomId: e.target.value });
  }

  render() {
    return (
    <div>
      <h1>Join Page</h1>
        Room id: <input onChange={this.handleOnChange} type="text" name="roomid"></input>
        <button onClick={this.handleSubmit} >Submit</button>
    </div>);
  }
}

export default Join;