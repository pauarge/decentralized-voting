import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import CreateElection from "./components/CreateElection";
import ManagedElections from "./components/ManagedElections";
import Footer from "./components/Footer/FooterContainer";
import Routes from "./ Routes";
import './normalize.css';
import './App.scss';
import CandidateInput from "./components/CandidateInput";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      election: {
        title: "Placeholder",
        candidates: ["Bonadio Mclean", "Tiffney Bickis", "Grogin Dubie"],
        candidatesB: ["Peter Duke", "Nope Nobel", "Sandra Bollock", "Román Luz", "Arturo IV"],
        deadline: new Date(2019, 1, 1)
      }
    };
  }

  render() {
    const Home = () => (
      <div>
        <h2>Welcome page</h2>
      </div>
    );

    const { election } = this.state;
    return(
      <Router>
        <>
        <div className="Header">
          <div className="Header__Upper">
            <div className="Header__Nav">
              <div className="Header__Logo">
                Decent
              </div>
              <div className="Header__Link">
                <Link to="/">Home</Link>
              </div>
              <div className="Header__Link">
                <Link to="/create">Create Election</Link>
              </div>
              <div className="Header__Link">
                <Link to="/current">Current Election</Link>
              </div>
            </div>
          </div>
          <div className="Header__Lower">
            <h2 className="Header__Title">{election.title}</h2>
          </div>
        </div>
        <div className="Main">
          <Route exact path="/" component={Home} />
          <Route path="/create" component={CreateElection} />
          <Route
            path="/current"
            render={() => (
              <ManagedElections
                title={election.title}
                candidates={election.candidates}
                deadline={election.deadline}
              />
            )}
          />
          <Route path="/options" 
              render={() => (
                <CandidateInput
                  component={CandidateInput} 
                  title={election.title}
                  candidates={election.candidates}
                  candidatesB={election.candidatesB}
                 deadline={election.deadline} />
                )}
            />
          </div>
          <Footer />
        </>
      </Router>
    );
  }
}


export default App;
