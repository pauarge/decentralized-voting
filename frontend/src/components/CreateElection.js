import React, { Component } from "react";
import PropTypes from "prop-types";
import Box from "./UI/Containers";
import { Redirect } from "react-router-dom";
import "./CreateElection.scss";

export default class CreateElection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      candidates: [{ name: "" }],
      deadline: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.addCandidate = this.addCandidate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = e => {
    if (["name"].includes(e.target.className)) {
      let candidates = [...this.state.candidates];
      candidates[e.target.dataset.id][
        e.target.className
      ] = e.target.value.toUpperCase();
      this.setState({ candidates }, () => console.log(this.state.candidates));
    } else {
      this.setState({ [e.target.name]: e.target.value.toUpperCase() });
    }
  };

  addCandidate = e => {
    this.setState(prevState => ({
      candidates: [...prevState.candidates, { name: "" }]
    }));
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.onSubmit(this.state);
    this.setState({
      submitted: true
    });
  };

  render() {
    let { title, candidates } = this.state;

    const component = this.state.submitted ? (
      <Redirect to="/add-voters" />
    ) : (
      <>
      <h1 className="Page__Title">Register a new election event</h1>
      <Box>
        <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
          
          <label className="Input__Label" htmlFor="title">Name of the event</label>
          <input className="Input__Text" type="text" name="title" id="title" value={title} />
          <hr />
          <div className="Form__Rack">
            {candidates.map((val, idx) => {
              let candidateId = `candidate-${idx}`;
              return (
                <div className="Form__Cell" key={idx}>
                  <label className="Input__Label" htmlFor={candidateId}>{`Candidate #${idx + 1}`}</label>
                  <input
                    type="text"
                    name={candidateId}
                    data-id={idx}
                    id={candidateId}
                    value={candidates[idx].name}
                    className="name Input__Text"
                  />
                </div>
              );
            })}
            <button className="Button Button__Secondary" onClick={this.addCandidate}>Add candidate</button>
          </div>
          
          <input type="submit" value="Submit" className="Button Button__Green" />
        </form>
      </Box>
      </>
    );

    return component;
  }
}

CreateElection.propTypes = {
  onSubmit: PropTypes.func
};
