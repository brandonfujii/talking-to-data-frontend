import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './style.css';

class SelectPopUp extends Component {
  constructor(props) {
    super(props);
  }

  addType = type => {
    console.log(type);
  };

  render() {
    return (
      <span className="popup-txt">
        <button onClick={() => this.addType(0)}> Number </button>
        <button onClick={() => this.addType(1)}> Quote </button>
        <button onClick={() => this.addType(1)}> Star </button>
      </span>
    );
  }
}
/**
SelectPopUp.propTypes = {
  article: PropTypes.string.isRequired,
  claims: PropTypes.array.isRequired
};
**/

export default SelectPopUp;
