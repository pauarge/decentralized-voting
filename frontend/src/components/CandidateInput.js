import React, { Component } from "react";
import PropTypes from "prop-types";
import Poll, { PollOption } from "./UI/Poll";
import Footer from "./Footer/FooterContainer";
import "./ManagedElections.scss";

export default class Candid0ateInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: -1
    };

    this.selectCandidate = this.selectCandidate.bind(this);
  }

  selectCandidate(index) {
    console.log(index);
    this.props.onSelect(index);
    this.setState({ selected: index });
  }

  render() {
    return (
      <>
        <h1 className="Page__Title">Select your options</h1>
        <p className="Page__Lead">
          Click or tap to pick your preferred candidate from each category below
        </p>

        <h3 className="Section__Header">Candidates</h3>
        <Poll pollName="lowerHouse">
          {this.props.candidates.map((candidate, idx) => (
            <PollOption
              arrayIndex={idx}
              onSelect={this.selectCandidate}
              candidateName={candidate.name}
              isSelected={idx === this.state.selected}
            />
          ))}
        </Poll>

        <Footer
          from="/add-voters"
          disabledTo={this.state.selected === -1}
          fromLabel="Back"
          to="/confirm"
          toLabel="Next"
        />
      </>
    );
  }
}

Candid0ateInput.propTypes = {
  onSelect: PropTypes.func.isRequired
};
