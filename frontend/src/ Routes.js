import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CreateElection from "./components/CreateElection";
import ManagedElections from "./components/ManagedElections";
import CandidateInput from "./components/CandidateInput";

export default () => (
  <Router>
    <Switch>
      <Route exact path="/" component={null} />
      <Route path="/create" component={CreateElection} />
      <Route path="/current" component={ManagedElections} />
      <Route path="/options" component={CandidateInput} />
      <Route path="/confirm" component={VoteConfirmation} />
      <Route path="/thank-you" component={VoteConfirmation} />
    </Switch>
  </Router>
);
