import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import CreateElection from "./components/CreateElection";
import ManagedElections from "./components/ManagedElections";
import VoteConfirmation from "./components/VoteConfirmation";
import Footer from "./components/Footer/FooterContainer";
import "./normalize.css";
import "./App.scss";
import CandidateInput from "./components/CandidateInput";
import AddVoters from "./components/AddVoters";
import { ErrorPage } from "./components/ErrorPage";
import SuccessPage from "./components/SuccessPage";

class App extends Component {
  constructor(props) {
    super(props);
    this.fetchCurrentElection();
    this.state = {
      election: {
        description: "",
        title: "",
        candidates: [],
        deadline: new Date(2019, 1, 1)
      },
      voters: [],
      voteIndex: 1
    };

    this.electCandidate = this.electCandidate.bind(this);
    this.storeElection = this.storeElection.bind(this);
    this.storeVoters = this.storeVoters.bind(this);
    this.fetchCurrentElection = this.fetchCurrentElection.bind(this);
  }

  async fetchCurrentElection() {
    fetch("http://127.0.0.1:5000/options", {
      method: "POST"
    }).then(response => {
      response.json().then(data => {
        console.log(data);
        this.setState({ election: data });
      });
    });
  }

  storeElection(election) {
    // console.log("Storing election");
    this.setState({
      election
    });
  }

  storeVoters(voters) {
    // console.log(voters);

    const { election } = this.state;

    this.setState({
      voters
    });

    console.log(voters.voters);
    // console.log([{ email: "bb816@ic.ac.uk", id: "111" }]);

    fetch("http://127.0.0.1:5000/election", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        users: voters.voters,
        name: election.title,
        description: election.description,
        expiration: 1540015431,
        options: election.candidates.map(candidate => candidate.name)
      })
    });
  }

  electCandidate(voteIndex) {
    this.setState({ voteIndex });
  }

  render() {
    const Home = () => (
      <div>
        <h2>Welcome page</h2>
      </div>
    );

    const { election, voteIndex } = this.state;
    return (
      <Router>
        <>
          <div className="Header">
            <div className="Header__Upper">
              <div className="Header__Nav">
                <div className="Header__Logo">Decent</div>
                <div className="Header__Link">
                  <Link to="/">Home</Link>
                </div>
                <div className="Header__Link">
                  <Link to="/create">Create Election</Link>
                </div>
                <div className="Header__Link">
                  <Link to="/current">Current Election</Link>
                </div>
                <div className="Header__Link">
                  <Link to="/verify">Verify Vote</Link>
                </div>
              </div>
            </div>
            <div className="Header__Lower">
              <h2 className="Header__Title">{election.title}</h2>
            </div>
          </div>
          <div className="Main">
            <Route exact path="/" component={Home} />
            <Route
              path="/create"
              render={() => <CreateElection onSubmit={this.storeElection} />}
            />
            <Route
              path="/add-voters"
              render={() => <AddVoters onSubmit={this.storeVoters} />}
            />
            <Route path="/qr-error" render={() => <ErrorPage />} />
            <Route path="/qr-success" render={() => <SuccessPage />} />
            <Route
              path="/options"
              render={() => (
                <ManagedElections
                  title={election.title}
                  selectedIndex={voteIndex}
                  candidates={election.candidates}
                  deadline={new Date(2019, 0, 1)}
                />
              )}
            />
            <Route
              path="/current"
              render={() => (
                <CandidateInput
                  component={CandidateInput}
                  onSelect={this.electCandidate}
                  title={election.title}
                  candidates={election.candidates}
                  deadline={election.deadline}
                />
              )}
            />
            <Route
              path="/confirm"
              render={() => (
                <VoteConfirmation
                  voteName={election.candidates[voteIndex].name}
                  electionTitle={election.description}
                />
              )}
            />
          </div>
        </>
      </Router>
    );
  }
}

export default App;
