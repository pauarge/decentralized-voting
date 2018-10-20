import React, { Component } from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";

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
      <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
        <label htmlFor="title">Title</label>
        <input type="text" name="title" id="title" value={title} />

        <button onClick={this.addCandidate}>Add candidate</button>
        {candidates.map((val, idx) => {
          let candidateId = `candidate-${idx}`;
          return (
            <div key={idx}>
              <label htmlFor={candidateId}>{`Candidate #${idx + 1}`}</label>
              <input
                type="text"
                name={candidateId}
                data-id={idx}
                id={candidateId}
                value={candidates[idx].name}
                className="name"
              />
            </div>
          );
        })}
        <input type="submit" value="Submit" />
      </form>
    );

    return component;
  }
}

CreateElection.propTypes = {
  onSubmit: PropTypes.func
};
