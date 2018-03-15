import React, { Component } from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';
import style from './style.css';

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
    event.preventDefault();
    this.props.handleLogin(event);
  }

  render() {
    return (
      <div id="login">
        <div id="login-form">
          <form onSubmit={this.handleSubmit} className="form-group">
            <div className="form-group">
              <label htmlFor="inputUsername">Username</label>
              <input
                type="text"
                id="inputUsername"
                className="form-control"
                placeholder="Username"
                value={this.state.value}
                onChange={this.handleChangeU}
              />
            </div>
            <div className="form-group">
              <label htmlFor="inputPassword">Password</label>
              <input
                type="password"
                id="inputPassword"
                className="form-control"
                placeholder="Password"
                value={this.state.value}
                onChange={this.handleChangeP}
              />
            </div>
            <br />
            <button type="submit" className="btn btn-primary mb-2">
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
