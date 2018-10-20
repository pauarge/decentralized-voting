import React, { Component } from "react";
import PropTypes from "prop-types";
import Box from "./UI/Containers";
import Poll, {PollOption} from "./UI/Poll";
import "./ManagedElections.scss";

export default class ManagedElections extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const deadlineDate = this.props.deadline.toLocaleDateString();
    return (
      <>
        <h1 className="Page__Title">Welcome
          <span className="Page__Title--deadline">Deadline: {deadlineDate}</span>
        </h1>
        <Box isLarge="false">
          <div className="QR__Container">
            <div className="QR__Placeholder">
              ...
            </div>
            <div className="QR__Instructions">
              <h3 className="QR__Tagline">
                Please scan the QR code provided to you in order to authenticate.
              </h3>
              <p>
                First chunk of text.
              </p>
              <p>
                Second chunk of text.
              </p>
            </div>
          </div>
        </Box>
      </>
      
    );
  }
}

ManagedElections.propTypes = {
  title: PropTypes.string.isRequired,
  candidates: PropTypes.array.isRequired,
  deadline: PropTypes.instanceOf(Date).isRequired
};
