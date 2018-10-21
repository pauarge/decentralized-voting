import React, { Component } from "react";

import Footer from "./Footer/FooterContainer";
import "../App.scss";
import "./ManagedElections.scss";

export default class ResultsPage extends Component {
  render() {
    return (
      <>
        <h1 className="Page__Title">The voting has ended.</h1>
        <p className="Page__Lead">Option 1: 35 votes.</p>
        <p className="Page__Lead">Option 2: 72 votes.</p>
        <p className="Page__Lead">Option 3: 98 votes.</p>
        {/* <Footer from="/options" fromLabel="Try again" /> */}
      </>
    );
  }
}
