import React from 'react';
import { Link , Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import '../styles/HomePage.css';
import axios from 'axios';

class HomePage extends React.Component{
  state = {
    roomid : null, 
    redirect : false
  }

// const HomePage: React.FC = () => {
  // const [roomid, redirect] = useState({roomid : null, redirect : false});
  renderRedirect = () => {
    if(this.state.redirect){
      return <Redirect to={{
        pathname: '/room',
        search: "?roomid=" + this.state.roomid,
      }} />
    }
  }

  createRoom = async () => {
    var res = await axios.post('http://localhost:8080/rooms', {})
    // renderRedirect(res.data);
    this.setState({roomid : res.data, redirect: true});
  }
  render() {
    return (
      <div className="App">
        <h1>Sync Along</h1>
        {this.renderRedirect()}
        {/* <Button component={Link} to="/rooms" color="primary">Create</Button> */}
        <Button onClick ={this.createRoom} color="primary">Create</Button>
        <Button component={Link} to="/join" color="primary">Join</Button>
        <Button component={Link} to="/rooms" color="primary">Discover</Button>
      </div>
    );
  }
}

export default HomePage;
