import React, { Component } from "react";
import PropTypes from "prop-types";
import QrReader from "react-qr-reader";

export default class ManagedElections extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null
    };

    this.handleScan = this.handleScan.bind(this);
  }

  handleScan(result) {
    if (result) {
      this.setState({
        link: result
      });
      console.log(result);
    }
    // Make vote api call
  }

  handleError(err) {
    console.error(err);
  }

  render() {
    const previewStyle = {
      height: 240,
      width: 320
    };
    return (
      <div>
        <h3>{this.props.title}</h3>
        {this.props.candidates.map(candidate => (
          <p>Candidate: {candidate.name}</p>
        ))}
        <p>Deadline: {this.props.date}</p>
        <h3>Scan voter's QR Code: </h3>
        <QrReader
          style={previewStyle}
          onError={this.handleError}
          onScan={this.handleScan}
        />
      </div>
    );
  }
}

ManagedElections.propTypes = {
  title: PropTypes.string.isRequired,
  candidates: PropTypes.array.isRequired,
  deadline: PropTypes.instanceOf(Date).isRequired
};
