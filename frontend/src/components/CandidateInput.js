import React, { Component } from "react";
import PropTypes from "prop-types";
import Box from "./UI/Containers";
import Poll, { PollOption } from "./UI/Poll";
import Footer from "./Footer/FooterContainer";
import "./ManagedElections.scss";

export default class Candid0ateInput extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log(this.props.candidates);
    return (
      <>
        <h1 className="Page__Title">Select your options</h1>
        <p className="Page__Lead">
          Click or tap to pick your preferred candidate from each category below
        </p>

        <h3 className="Section__Header">Candidates</h3>
        <Poll pollName="lowerHouse">
          {this.props.candidates.map((candidate, idx) => (
            <PollOption index={idx} candidateName={candidate.name} />
          ))}
        </Poll>

        <Footer
          from="/add-voters"
          fromLabel="Back"
          to="/confirm"
          toLabel="Next"
        />
      </>
    );
  }
}
