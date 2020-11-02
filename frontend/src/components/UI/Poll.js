import React, { Component } from "react";
import PropTypes from "prop-types";

import "./Poll.scss";

export default class Poll extends Component {
  render() {
    return <div className="Poll">{this.props.children}</div>;
  }
}

export class PollOption extends Component {
  render() {
    const { candidateName, isSelected, onSelect, arrayIndex } = this.props;

    return (
      <div
        onClick={() => (isSelected ? onSelect(-1) : onSelect(arrayIndex))}
        className={isSelected ? "Poll__Option__Selected" : "Poll__Option"}
      >
        <div className="Poll__Avatar" />
        <div className="Poll__Info">
          <label
            htmlFor="candidateName"
            className={
              isSelected ? "Candidate__Label__Selected" : "Candidate__Label"
            }
          >
            Candidate name:
          </label>
          <h3
            name="candidateName"
            className={
              isSelected ? "Candidate__Name__Selected" : "Candidate__Name"
            }
          >
            {candidateName}
          </h3>
        </div>
      </div>
    );
  }
}

PollOption.propTypes = {
  candidateName: PropTypes.string.isRequired,
  arrayIndex: PropTypes.number.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired
};
