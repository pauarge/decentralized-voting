import React, { Component } from "react";
import PropTypes from "prop-types";
import QrReader from "react-qr-reader";
import { Redirect } from "react-router-dom";
import Box from "./UI/Containers";
import "./ManagedElections.scss";
import SERVER_PATH from "../config";

export default class VerifyVote extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null
    };

    this.handleScan = this.handleScan.bind(this);
  }

  handleScan(result) {
    console.log(this.state);
    if (result) {
      this.setState({
        responseCode: null
      });
      console.log(result);

      fetch(`${SERVER_PATH}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: result,
          option: this.props.selectedIndex
        })
      }).then(response => this.setState({ responseCode: response.status }));
    }
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
      <>
        <h1 className="Page__Title">Verify your vote</h1>
        <Box isLarge="false">
          <div className="QR__Container">
            <div className="QR__Placeholder">
              <QrReader
                style={previewStyle}
                onError={this.handleError}
                onScan={this.handleScan}
              />
            </div>
            <div className="QR__Instructions">
              <h3 className="QR__Tagline">
                Please scan the QR code provided to you in order to verify your
                vote.
              </h3>
              {/* {this.state.result ? <h2>{fetch("http://127.0.0.1/proof", )}</h2>}     */}
            </div>
          </div>
        </Box>
        {/* {this.redirectOptions()} */}
      </>
    );
  }
}

VerifyVote.propTypes = {
  title: PropTypes.string.isRequired,
  selectedIndex: PropTypes.number.isRequired
};
