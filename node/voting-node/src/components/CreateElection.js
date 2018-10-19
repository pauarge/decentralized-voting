import React, { Component } from "react";
import PropTypes from "prop-types";

export default class CreateElection extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>CREATE ELECTION PAGE</div>;
  }
}

CreateElection.propTypes = {
  saveElection: PropTypes.func
};
