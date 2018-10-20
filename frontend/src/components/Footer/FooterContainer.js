import React, {Component} from 'react';
import "./FooterContainer.scss";

export default class Footer extends Component {
    render() {
        return(
            <div className="Footer">
                <div className="Footer__Nav">
                    <button className="Button Button__Secondary Button__Back">Back</button>
                    <button className="Button Button__Green Button__Right Button__Next">Next step</button>
                </div>
            </div>
        );
    }
}