import React, { Component } from 'react';
import PropTypes from 'prop-types';

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

/*
Filter.propTypes = {
  article: PropTypes.string.isRequired,
  claims: PropTypes.array.isRequired,
  filterByClaimType: PropTypes.func.isRequired
};
*/

export default Filter;
