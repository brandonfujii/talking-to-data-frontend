import React, { Component } from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';
import style from './style.css';

class TextField extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSelectionEvent(e) {
    // Implement this
  }

  renderTextHtml(text, claims) {
    let htmlString = text;
    let numShift = 0;

    for (let i = 0; i < claims.length; ++i) {
      let claim = claims[i];
      let beforeText = htmlString.slice(0, claim.start_index + numShift);
      let claimText = htmlString.slice(
        claim.start_index + numShift,
        claim.end_index + numShift
      );
      let afterText = htmlString.slice(claim.end_index + numShift);

      const openTag = `<span id=${claim.id} className="highlight type-${
        claim.type_id
      }">`;
      const closingTag = '</span>';
      claimText = `${openTag}${claimText}${closingTag}`;
      htmlString = `${beforeText}${claimText}${afterText}`;
      numShift += openTag.length + closingTag.length;
    }

    return htmlString;
  }

  renderClaimFiltered(text, claims, claim_type) {
    let htmlString = text;
    let numShift = 0;
    for (let i = 0; i < claims.length; ++i) {
      let claim = claims[i];
      if (claim.type_id !== claim_type) {
        continue;
      }
      let beforeText = htmlString.slice(0, claim.start_index + numShift);
      let claimText = htmlString.slice(
        claim.start_index + numShift,
        claim.end_index + numShift
      );
      let afterText = htmlString.slice(claim.end_index + numShift);

      const openTag = `<span id=${claim.id} className="highlight type-${
        claim.type_id
      }">`;
      const closingTag = '</span>';
      claimText = `${openTag}${claimText}${closingTag}`;
      htmlString = `${beforeText}${claimText}${afterText}`;
      numShift += openTag.length + closingTag.length;
    }

    return htmlString;
  }

  render() {
    return (
      <div style={style}>
        {this.props.filter == -1
          ? renderHTML(
              this.renderTextHtml(this.props.article, this.props.claims)
            )
          : renderHTML(
              this.renderClaimFiltered(
                this.props.article,
                this.props.claims,
                this.props.filter
              )
            )}
      </div>
    );
  }
}

TextField.propTypes = {
  article: PropTypes.string.isRequired,
  claims: PropTypes.array.isRequired
};

export default TextField;
