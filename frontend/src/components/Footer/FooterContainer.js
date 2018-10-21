import React, { Component } from "react";
import PropTypes from "prop-types";
import LinkButton from "./../UI/LinkButton";
import "./FooterContainer.scss";

export default class Footer extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="Footer">
        <div className="Footer__Nav">
          <LinkButton
            to={this.props.from}
            className="Button Button__Secondary Button__Back"
          >
            {this.props.fromLabel}
          </LinkButton>
          {this.props.to ? (
            <LinkButton
              disabled={this.props.disabled}
              to={this.props.to}
              className={
                this.props.disabledTo
                  ? "Button Button__Disabled Button__Right Button__Next"
                  : "Button Button__Green Button__Right Button__Next"
              }
            >
              {this.props.toLabel}
            </LinkButton>
          ) : null}
        </div>
      </div>
    );
  }
}

Footer.propTypes = {
  to: PropTypes.string,
  disabledTo: PropTypes.bool.isRequired
};
