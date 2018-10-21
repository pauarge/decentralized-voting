import React, {Component} from "react";
import Box from "./UI/Containers";

export default class Home extends Component {
    render() {
        return(
            <>
            <h3 className="Page__Pretitle">Decentralized Voting System</h3>
            <Box nopad>
                <div className="Flex__Double">
                    <div className="Flex__Half Flex__Grey Flex__Separator">
                        <h2 classNames="Page__Halftitle">{this.props.name}</h2>
                        <p className="Page__Text">Voting process for {this.props.name} is currently open. Authenticate here to see the options available and cast your vote.</p>

                        <p className="Page__Text">
                            <button className="Button Button__Green">Vote now</button>
                        </p>
                    </div>
                    <div className="Flex__Half">
                        <h2 classNames="Page__Halftitle">Register a new event</h2>
                        <p className="Page__Text">Use the following form to sign up for a new electoral issue or voting event.</p>
                        <p className="Page__Text">
                            <button className="Button Button__Secondary">Sign up</button>
                        </p>
                    </div>
                </div>
            </Box>
            </>
        );
    }
}