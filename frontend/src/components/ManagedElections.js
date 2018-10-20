import React, { Component } from "react";
import PropTypes from "prop-types";
import QrReader from "react-qr-reader";
import Box from "./UI/Containers";
import Footer from "./Footer/FooterContainer";
import Poll, {PollOption} from "./UI/Poll";
import "./ManagedElections.scss";

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
    const deadlineDate = this.props.deadline.toLocaleDateString();
    const previewStyle = {
      height: 240,
      width: 320
    };
    return (
      <>
        <h1 className="Page__Title">Welcome
          <span className="Page__Title--deadline">Deadline: {deadlineDate}</span>
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
        <Footer from="/" fromLabel="Home" to="/options" toLabel="Next" />
      </>
    );
  }
}


ManagedElections.propTypes = {
  title: PropTypes.string.isRequired,
  candidates: PropTypes.array.isRequired,
  deadline: PropTypes.instanceOf(Date).isRequired
};
