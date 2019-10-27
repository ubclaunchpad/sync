import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import '../styles/HomePage.css';
import { init } from '../api/socketIo';

const HomePage: React.FC = () => {
  useEffect(() => {
    init();
  });
  return (
    <div className="App">
      <h1>Sync Along</h1>
      <Button component={Link} to="/rooms" color="primary">Create</Button>
      <Button component={Link} to="/rooms" color="primary">Join</Button>
      <Button component={Link} to="/rooms" color="primary">Discover</Button>
    </div>
  );
}

export default HomePage;
