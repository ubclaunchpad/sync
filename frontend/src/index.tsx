import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import RoomsPage from './components/RoomsPage';
import HomePage from './components/HomePage';
import JoinPage from './components/JoinPage';
import Room from './components/Room';
import Home from "./components/Home";
import Browse from "./components/Browse";

const App = (
  <Router>
    <div>
      <Route exact path="/" component={Home} />
      <Route path="/join" component={JoinPage} />
      <Route path="/room" component={Room} />
      <Route path="/rooms" component={Browse} />
    </div>
  </Router>
);

ReactDOM.render(App, document.getElementById('root'))
