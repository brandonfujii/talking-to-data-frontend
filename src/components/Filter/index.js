import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Filter extends Component {
  constructor(props) {
    super(props);
  }

  handleFilterByProperNoun() {
    this.props.filterByProperNoun();
  }

  render() {
    return <div>Hello fucking world</div>;
  }
}

Filter.propTypes = {
  article: PropTypes.string.isRequired,
  claims: PropTypes.array.isRequired,
  filterByProperNoun: PropTypes.func.isRequired
};

export default Filter;
