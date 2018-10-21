import React, { Component } from "react";
import "./VoteConfirmation.scss";

import Footer from "./Footer/FooterContainer";
import "../App.scss";
import "./ManagedElections.scss";

export default class SuccessPage extends Component {
  render() {
    return (
      <>
        <div className="FeedbackAlert Feedback--Green">
            <div className="FA__Tick"></div>
            <h1 className="FA__Title">You're all set!</h1>
            <p className="FA__Text">
                Your vote has been cast successfully. Results will be published after deadline.
            </p>
            <p className="FA__Centered">
                <button className="Button Button__Green">Home</button>
            </p>
        </div> 
      </>
    );
  }
}
