import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Sync Along</h1>
      <Button component={Link} to="/rooms" color="primary">Create</Button>
      <Button component={Link} to="/rooms" color="primary">Join</Button>
      <Button component={Link} to="/rooms" color="primary">Discover</Button>
    </div>
  );
}

export default App;
