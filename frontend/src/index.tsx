import React from "react";
import ReactDOM from "react-dom";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Room from "./components/Room";
import Home from "./components/Home";
import Browse from "./components/Browse";
import "./styles/index.css";
import "typeface-roboto";
import "typeface-libre-baskerville";

const App = (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/browse" component={Browse} />
      <Route exact path="/:id" component={Room} />
    </Switch>
  </BrowserRouter>
);

ReactDOM.render(App, document.getElementById("root"));
