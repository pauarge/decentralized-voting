import React, { Component } from "react";
import "./Poll.scss";

export default class Poll extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="Poll">{this.props.children}</div>;
  }
}

export class PollOption extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Poll__Option">
        <div className="Poll__Avatar" />
        <div className="Poll__Info">
          <label htmlFor="candidateName" className="Candidate__Label">
            Candidate name:
          </label>
          <h3 name="candidateName" className="Candidate__Name">
            {this.props.candidateName}
          </h3>
        </div>
      </div>
    );
  }
}
