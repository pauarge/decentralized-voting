import React, { Component } from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";

export default class AddVoters extends Component {
  state = {
    voters: [{ email: "", id: "" }]
  };

  handleChange = e => {
    if (["email", "id"].includes(e.target.className)) {
      let voters = [...this.state.voters];
      voters[e.target.dataset.id][
        e.target.className
      ] = e.target.value.toUpperCase();
      this.setState({ voters }, () => console.log(this.state.voters));
    } else {
      this.setState({ [e.target.name]: e.target.value.toUpperCase() });
    }
  };

  addVoter = e => {
    console.log(this.state);
    this.setState(prevState => ({
      voters: [...prevState.voters, { email: "", id: "" }]
    }));
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.onSubmit(this.state);
    this.setState({ finalized: true });
  };

  render() {
    let { voters } = this.state;

    const component = this.state.finalized ? (
      <Redirect to="/current" />
    ) : (
      <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
        <button onClick={this.addVoter}>Add voter</button>
        {voters.map((val, idx) => {
          let voterId = `voter-${idx}`;
          let voterEmail = `voter-email-${idx}`;
          return (
            <div key={idx}>
              <label htmlFor={voterEmail}>Email </label>
              <input
                type="text"
                name={voterEmail}
                data-id={idx}
                id={voterEmail}
                value={voters[idx].email}
                className="email"
              />
              <label htmlFor={voterId}>Voter ID </label>
              <input
                type="text"
                name={voterId}
                data-id={idx}
                id={voterId}
                value={voters[idx].id}
                className="id"
              />
            </div>
          );
        })}
        <input type="submit" value="Finalize" />
      </form>
    );

    return component;
  }
}

AddVoters.PropTypes = {
  onSubmit: PropTypes.func.isRequired
};
