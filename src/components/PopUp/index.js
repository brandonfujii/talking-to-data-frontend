import React, { Component } from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';
//import style from './style.css';
import TextField from '../TextField';
import Filter from '../Filter';

class PopUp extends Component {
  constructor(props) {
    super(props);
  }

  render() {}
}

PopUp.propTypes = {
  article: PropTypes.string.isRequired,
  claims: PropTypes.array.isRequired
};

export default PopUp;
