import React, { Component } from "react";
import {Doughnut} from 'react-chartjs-2';
 
import Footer from "./Footer/FooterContainer";
import "../App.scss";
import "./ManagedElections.scss";

const data = {
	labels: [
		'Red',
		'Green',
		'Yellow'
	],
	datasets: [{
		data: [300, 50, 100],
		backgroundColor: [
      '#f95d6a',
      '#a05195',
      '#2f4b7c',
      '#d45087',
      '#ffa600',
      '#665191',
      '#ff7c43',
      '#003f5c'
		],
	}]
};

export default class ResultsPage extends Component {
  render() {
    return (
      <>
        <h1 className="Page__Title">The voting has ended.</h1>
        <p className="Page__Lead">Option 1: 35 votes.</p>
        <p className="Page__Lead">Option 2: 72 votes.</p>
        <p className="Page__Lead">Option 3: 98 votes.</p>

        <Doughnut data={data} />

        {/* <Footer from="/options" fromLabel="Try again" /> */}
      </>
    );
  }
}
