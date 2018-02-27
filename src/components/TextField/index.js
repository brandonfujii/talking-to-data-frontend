import React, { Component } from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';
import style from './style.css';
import PopUp from '../PopUp/index.js';
import SelectPopUp from '../SelectPopUp/index.js';

class TextField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false
    };
  }
  // tester function
  clickHandler = () => {
    console.log('Here');
  };
  //render text using jsx
  renderTextJSX = (text, claims) => {
    let htmlString = text;
    let numShift = 0;
    let everything = [];

    if (claims.length == 0) {
      everything.push(this.createTextSpan(text));
    } else {
      // for the first claim we want to append the before text and the first claim
      let claim1 = claims[0];
      let beforeText = htmlString.slice(0, claim1.start_index + numShift);
      let claimText = htmlString.slice(
        claim1.start_index + numShift,
        claim1.end_index + numShift
      );
      everything.push(this.createSpan(beforeText, claim1, claimText));

      //for the rest of the claims
      for (let i = 0; i < claims.length - 1; ++i) {
        let claim1 = claims[i];
        let claim2 = claims[i + 1];
        let beforeText = htmlString.slice(
          claim1.end_index,
          claim2.start_index + numShift
        );
        let claimText = htmlString.slice(
          claim2.start_index + numShift,
          claim2.end_index + numShift
        );
        everything.push(this.createSpan(beforeText, claim2, claimText));
      }
      //the rest of the text
      let afterText = htmlString.slice(claims[claims.length - 1].end_index);
      everything.push(this.createTextSpan(afterText, 'afterText'));
    }
    return everything;
  };
  //just return a span for text
  createTextSpan = (text, textId) => {
    return <span key={`span-${textId}`}>{text}</span>;
  };
  //return a span for text and a claim
  createSpan = (beforeText, claim, claimText) => {
    return (
      <span key={`span-${claim.id}`}>
        <span> {beforeText} </span>
        <span id={claim.id} className={`highlight type-${claim.type_id}`}>
          {claimText}
          <PopUp />
        </span>
      </span>
    );
  };
  //what to do when event is selected
  handleSelectionEvent = () => {
    /**
      this.setState(prevState => ({
        selected: !prevState.selected
      }));
      **/
    var txt = '';
    if (window.getSelection) {
      txt = window.getSelection();
    } else if (document.getSelection) {
      txt = document.getSelection();
    } else if (document.selection) {
      txt = document.selection.createRange().text;
    }
    if (txt != '') {
      alert('Selected text is: ' + txt);
    }
  };

  render() {
    return (
      <div style={style} onClick={this.handleSelectionEvent}>
        {this.props.claims && this.props.article
          ? this.renderTextJSX(this.props.article, this.props.claims)
          : null}
        <SelectPopUp />
      </div>
    );
  }
}

TextField.propTypes = {
  article: PropTypes.string.isRequired,
  claims: PropTypes.array.isRequired
};

export default TextField;
