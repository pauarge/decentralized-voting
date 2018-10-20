import React, {Component} from 'react';
import PropTypes from "prop-types";
import Box from "./UI/Containers";
import Poll, {PollOption} from "./UI/Poll";
import "./ManagedElections.scss";

export default class Candid0ateInput extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <>
                <h1 className="Page__Title">Select your options</h1>
                <p className="Page__Lead">Click or tap to pick your preferred candidate from each category below</p>

                <h3 className="Section__Header">Lower House</h3>
                <Poll pollName="lowerHouse">
                    {this.props.candidates.map(candidate => (
                        <PollOption candidateName={candidate}/>
                    ))}
                </Poll>

                <h3 className="Section__Header">Upper House (senate)</h3>
                <Poll pollName="lowerHouse">
                    {this.props.candidatesB.map(candidateB => (
                        <PollOption candidateName={candidateB}/>
                    ))}
                </Poll>
            </>
        );
    }
}