import React, { Component } from "react";
import PropTypes from "prop-types";
import QrReader from "react-qr-reader";
import { Redirect } from "react-router-dom";
import Box from "./UI/Containers";
import Footer from "./Footer/FooterContainer";
import Poll, { PollOption } from "./UI/Poll";
import "./ManagedElections.scss";

export default class ManagedElections extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      disabledTo: true
    };

    this.handleScan = this.handleScan.bind(this);
    this.redirectOptions = this.redirectOptions.bind(this);
  }

  redirectOptions() {
    if (this.state.responseCode === 400) {
      return <Redirect to="/qr-error" />;
    } else if (this.state.responseCode === 200) {
      return <Redirect to="/qr-success" />;
    }
  }

  handleScan(result) {
    console.log(this.state);
    if (result) {
      this.setState({
        result,
        disabledTo: false,
        responseCode: null
      });
      console.log(result);
      console.log(this.props.selectedIndex);

      fetch("http://127.0.0.1:5000/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: result,
          option: this.props.selectedIndex
        })
      }).then(
        response => this.setState({ responseCode: response.status })
        // response.status === 400 ? (
        //   <Redirect to="/current" />
        // ) : (
        //   console.log("Great success")
        // )
      );
    }
    // Make vote api call
  }

  handleError(err) {
    console.error(err);
  }
  render() {
    const deadlineDate = this.props.deadline.toLocaleDateString();
    const previewStyle = {
      height: 240,
      width: 320
    };
    return (
      <>
        <h1 className="Page__Title">
          Welcome
          <span className="Page__Title--deadline">
            Deadline: {deadlineDate}
          </span>
        </h1>
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
                Please scan the QR code provided to you in order to
                authenticate.
              </h3>
              <p>First chunk of text.</p>
              <p>Second chunk of text.</p>
            </div>
          </div>
        </Box>
        {this.redirectOptions()}
      </>
    );
  }
}

ManagedElections.propTypes = {
  title: PropTypes.string.isRequired,
  candidates: PropTypes.array.isRequired,
  deadline: PropTypes.instanceOf(Date).isRequired,
  selectedIndex: PropTypes.number.isRequired
};
