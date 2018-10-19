import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CreateElection from "./components/CreateElection";
import ManagedElections from "./components/ManagedElections";

export default () => (
  <Router>
    <Switch>
      <Route exact path="/" component={null} />
      <Route path="/create" component={CreateElection} />
      <Route path="/current" component={ManagedElections} />
    </Switch>
  </Router>
);
