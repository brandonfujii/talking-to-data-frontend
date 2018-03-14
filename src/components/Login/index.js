import React, { Component } from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
    this.handleChangeP = this.handleChangeP.bind(this);
    this.handleChangeU = this.handleChangeU.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeU(event) {
    this.setState({
      username: event.target.value,
      password: this.state.password
    });
  }
  handleChangeP(event) {
    this.setState({
      username: this.state.username,
      password: event.target.value
    });
  }
  handleSubmit(event) {
    return null;
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={this.state.value}
            onChange={this.handleChangeU}
          />
          <br />
          Password:
          <input
            type="password"
            value={this.state.value}
            onChange={this.handleChangeP}
          />
          <br />
          <input type="submit" value="Login" />
        </label>
      </form>
    );
  }
}

export default Login;
