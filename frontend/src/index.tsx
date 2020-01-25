import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import Room from './components/Room';
import Home from "./components/Home";
import Browse from "./components/Browse";
import './styles/index.css';

const App = (
  <Router>
    <div>
      <Route exact path="/" component={Home} />
      <Route exact path="/rooms/:id" component={Room} />
      <Route exact path="/rooms" component={Browse} />
    </div>
  </Router>
);

ReactDOM.render(App, document.getElementById('root'))
