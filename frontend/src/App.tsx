import React, { useEffect } from 'react';
import './App.css';
import { init } from './api/socketIo';

const App: React.FC = () => {
  useEffect(() => {
    init();
  });
  return (
    <div className="App">
      <h1>Sync Along</h1>
    </div>
  );
}

export default App;
