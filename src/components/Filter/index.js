import React, { Component } from 'react';

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <button className="filter" onClick={() => this.props.onClick()}>
        {this.props.name}
      </button>
    );
  }
}

export default Filter;
