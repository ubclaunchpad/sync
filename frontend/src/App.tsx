import React from 'react';
import YouTube from 'react-youtube';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Sync Along</h1>
      <YouTube videoId={'HXcSGuYUkDg'}/>
    </div>
  );
}

export default App;
