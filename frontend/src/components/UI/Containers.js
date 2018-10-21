import React, { Component } from "react";
import "./Containers.scss";

class Box extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <div className={this.props.nopad ? "Box Box__NP" : "Box "}>
                {this.props.children}
            </div>
        );
    }
}

export default Box;