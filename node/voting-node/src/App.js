import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import CreateElection from "./components/CreateElection";
import ManagedElections from "./components/ManagedElections";
import HeaderContainer from "./components/Header/HeaderContainer";
import Routes from "./ Routes";
import './normalize.css';
import './App.scss';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      election: {
        title: "Placeholder",
        candidates: ["A", "B", "C"],
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
    
    const Topics = () => (
      <div>
          <h2>Topics page</h2>
      </div>
    );

    const Topic = ({ match }) => (
      <div>
        <h3>{match.params.topicId}</h3>
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
                DeCent
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
        <div class="Main">
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
        </div>
        </>
      </Router>
    );
  }
}
/*class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      election: {
        title: "Placeholder",
        candidates: ["A", "B", "C"],
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

    const Topics = ({ match }) => (
      <div>
        <h2>Topics</h2>
        <ul>
          <li>
            <Link to={`${match.url}/rendering`}>Rendering with React</Link>
          </li>
          <li>
            <Link to={`${match.url}/components`}>Components</Link>
          </li>
          <li>
            <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
          </li>
        </ul>
        <Route path={`${match.path}/:topicId`} component={Topic} />
        <Route
          exact
          path={match.path}
          render={() => <h3>Please select a topic.</h3>}
        />
      </div>
    );

    const Topic = ({ match }) => (
      <div>
        <h3>{match.params.topicId}</h3>
      </div>
    );
    const { election } = this.state;
    
    return (
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/create">Create Election</Link>
            </li>
            <li>
              <Link to="/current">Current Election</Link>
            </li>
            <li>
              <Link to="/example">Tut</Link>
            </li>
          </ul>

          <hr />

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
          <Route path="/example" component={Topics} />
        </div>
      </Router>
    );
  }
}*/

export default App;
