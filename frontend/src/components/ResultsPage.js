import React, { Component } from "react";

import Footer from "./Footer/FooterContainer";
import "../App.scss";
import "./ManagedElections.scss";
import { SERVER_PATH } from "../config";

export default class ResultsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: [],
      votes: []
    };

    this.fetchCurrentElection();
  }

  async fetchCurrentElection() {
    fetch(`${SERVER_PATH}/results`, {
      method: "POST"
    }).then(response => {
      response.json().then(data => {
        console.log(data);
        this.setState({ options: data.options, votes: data.results });
      });
    });
  }

  render() {
    return (
      <>
        <h1 className="Page__Title">The voting has ended.</h1>
        {this.state.options.map(option => (
          <p className="Page__Lead">
            {option.name} :{" "}
            {this.state.votes[option.index.toString()]
              ? this.state.votes[option.index.toString()]
              : 0}
          </p>
        ))}
        {/* <Footer from="/options" fromLabel="Try again" /> */}
      </>
    );
  }
}
