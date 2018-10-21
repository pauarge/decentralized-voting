import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";

import Footer from "./Footer/FooterContainer";
import "../App.scss";
import "./ManagedElections.scss";
import { SERVER_PATH } from "../config";

const backgroundColor = [
  "#f95d6a",
  "#a05195",
  "#2f4b7c",
  "#d45087",
  "#ffa600",
  "#665191",
  "#ff7c43",
  "#003f5c"
];

const data = {
  labels: ["Red", "Green", "Yellow"],
  datasets: [
    {
      data: [300, 50, 100],
      backgroundColor: [
        "#f95d6a",
        "#a05195",
        "#2f4b7c",
        "#d45087",
        "#ffa600",
        "#665191",
        "#ff7c43",
        "#003f5c"
      ]
    }
  ]
};

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
    let labels = this.state.options.map(option => option.name);
    let data = this.state.options.map(
      option =>
        this.state.votes[option.index.toString()]
          ? this.state.votes[option.index.toString()]
          : 0
    );
    let datasets = { data, backgroundColor };
    let dataset = { labels, datasets: [datasets] };
    console.log(data);
    console.log(labels);
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
        <Doughnut data={dataset} />
      </>
    );
  }
}
