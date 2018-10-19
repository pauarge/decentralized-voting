import React, { Component } from "react";
import PropTypes from "prop-types";

export default class ManagedElections extends Component {
  render() {
    return (
      <div>
        <h3>{this.props.title}</h3>
        {this.props.candidates.map(candidate => (
          <p>Candidate: {candidate.name}</p>
        ))}
        <p>Deadline: {this.props.date}</p>
      </div>
    );
  }
}

ManagedElections.propTypes = {
  title: PropTypes.string.isRequired,
  candidates: PropTypes.array.isRequired,
  deadline: PropTypes.instanceOf(Date).isRequired
};
