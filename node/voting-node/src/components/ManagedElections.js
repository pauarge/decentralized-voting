import React, { Component } from "react";
import PropTypes from "prop-types";

/*export default class ManagedElections extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h3>{this.props.title}</h3>
        {this.props.candidates.map(candidate => (
          <p>Candidate: {candidate}</p>
        ))}
        <p>Deadline: {this.props.date}</p>
      </div>
    );
  }
}*/

export default class ManagedElections extends Component {
  /* constructor(props) {
    super(props);
  } */
  render() {
    return(
      <>ManagedElections</>
    );
  }
}

ManagedElections.propTypes = {
  title: PropTypes.string.isRequired,
  candidates: PropTypes.array.isRequired,
  deadline: PropTypes.instanceOf(Date).isRequired
};
