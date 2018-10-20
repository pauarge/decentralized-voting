import React, { Component } from "react";
import PropTypes from "prop-types";

import Box from "./UI/Containers";
import Footer from "./Footer/FooterContainer";
import "./VoteConfirmation.scss";

export default class VoteConfirmation extends Component {
  render() {
    const { voteName, electionTitle } = this.props;
    return (
      <>
        <h1 className="Page__Title">Vote confirm</h1>
        <p className="Page__Lead">
          Please verify that the options you wish to vote for are the following
        </p>
        <Box>
          <div class="Vote__Item">
            <div class="Vote__Avatar" />
            <div class="Vote__Info">
              <h4 class="Vote__Name">{voteName}</h4>
              <p class="Vote__Section">{electionTitle}</p>
            </div>
          </div>
        </Box>
        <Footer
          to="/options"
          toLabel="Finish and confirm"
          from="/current"
          fromLabel="Select options"
        />
      </>
    );
  }
}

VoteConfirmation.propTypes = {
  voteName: PropTypes.string.isRequired,
  electionTitle: PropTypes.string.isRequired
};
