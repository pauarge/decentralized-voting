import React, {Component} from 'react';
import Box from "./UI/Containers";
import Footer from "./Footer/FooterContainer";
import "./VoteConfirmation.scss";

export default class VoteConfirmation extends Component {
    render() {
        return(
            <>
                <h1 className="Page__Title">Vote confirm</h1>
                <p className="Page__Lead">Please verify that the options you wish to vote for are the following</p>
                <Box>
                    <div class="Vote__Item">
                        <div class="Vote__Avatar"></div>
                        <div class="Vote__Info">
                            <h4 class="Vote__Name">Yuri Gagarin</h4>
                            <p class="Vote__Section">Lower House</p>
                        </div>
                    </div>
                    <div class="Vote__Item">
                        <div class="Vote__Avatar"></div>
                        <div class="Vote__Info">
                            <h4 class="Vote__Name">José Sacristán</h4>
                            <p class="Vote__Section">Upper House</p>
                        </div>
                    </div>
                </Box>
                <Footer to="/" toLabel="Finish and confirm" from="/options" fromLabel="Back" />
            </>
        );
    }
}