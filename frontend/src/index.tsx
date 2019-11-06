import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import RoomsPage from './components/RoomsPage';
import HomePage from './components/HomePage';
import JoinPage from './components/JoinPage';
import Room from './components/Room'
import * as serviceWorker from './serviceWorker';

const routing = (
  <Router>
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/rooms">Rooms</Link>
        </li>
        <li>
          <Link to="/join">Join</Link>
        </li>
      </ul>
      <Route exact path="/" component={HomePage} />
      <Route path="/rooms" component={RoomsPage} />
      <Route path="/join" component={JoinPage} />
      <Route path="/room" component={Room} />
    </div>
  </Router>
)

ReactDOM.render(routing, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
