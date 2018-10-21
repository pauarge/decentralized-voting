import React, { Component } from "react";

import Footer from "./Footer/FooterContainer";
import "../App.scss";
import "./ManagedElections.scss";

export default class SuccessPage extends Component {
  render() {
    return (
      <>
        <h1 className="Page__Title">Success!</h1>
        <p className="Page__Lead">
          Your vote was registered, thank you for voting!
        </p>
        {/* <Footer from="/options" fromLabel="Try again" /> */}
      </>
    );
  }
}
