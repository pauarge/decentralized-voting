import React, { Component } from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import Box from "./UI/Containers";
import "./CreateElection.scss";

export default class AddVoters extends Component {
  state = {
    voters: [{ email: "", id: "" }]
  };

  handleChange = e => {
    if (["email", "id"].includes(e.target.className)) {
      let voters = [...this.state.voters];
      voters[e.target.dataset.id][e.target.className] = e.target.value;
      this.setState({ voters }, () => console.log(this.state.voters));
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  addVoter = e => {
    console.log(this.state);
    this.setState(prevState => ({
      voters: [...prevState.voters, { email: "", id: "" }]
    }));
  };

  handleSubmit = e => {
    console.log("AddVoters state");
    console.log(this.state);
    e.preventDefault();
    this.props.onSubmit(this.state);
    this.setState({ finalized: true });
  };

  render() {
    let { voters } = this.state;

    const component = this.state.finalized ? (
      <Redirect to="/current" />
    ) : (
      <>
        <h1 className="Page__Title">Add voters to the census</h1>
        <Box>
          <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
            {voters.map((val, idx) => {
              let voterId = `voter-${idx}`;
              let voterEmail = `voter-email-${idx}`;
              return (
                <div className="Form__Doubles" key={idx}>
                  <div className="Form__Half">
                    <label className="Input__Label" htmlFor={voterEmail}>
                      Email{" "}
                    </label>
                    <input
                      type="text"
                      name={voterEmail}
                      data-id={idx}
                      id={voterEmail}
                      className="email"
                    />
                  </div>
                  <div className="Form__Half">
                    <label className="Input__Label" htmlFor={voterId}>
                      Voter ID{" "}
                    </label>
                    <input
                      type="text"
                      name={voterId}
                      data-id={idx}
                      id={voterId}
                      className="id"
                    />
                  </div>
                </div>
              );
            })}
            <button
              type="button"
              className="Button Button__Secondary"
              onClick={this.addVoter}
            >
              Add voter
            </button>
            <hr />
            <input
              type="submit"
              className="Button Button__Green"
              value="Finalize"
            />
          </form>
        </Box>
      </>
    );

    return component;
  }
}

AddVoters.propTypes = {
  onSubmit: PropTypes.func.isRequired
};
