import React from "react";

import Footer from "./Footer/FooterContainer";
import "../App.scss";
import "./ManagedElections.scss";
import "./VoteConfirmation.scss";

export const ErrorPage = () => (
  <div>
    <div className="FeedbackAlert Feedback--Green">
        <div className="FA__Error"></div>
        <h1 className="FA__Title">Oops!</h1>
        <p className="FA__Text">
            An error occurred while processing your request. Please try again.
        </p>
    </div> 
    <Footer from="/options" fromLabel="Try again" />
  </div>
);
