import React, { Component } from "react";
import "./Containers.scss";

export default class Box extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <div className="Box">
                {this.props.children}
            </div>
        );
    }
}