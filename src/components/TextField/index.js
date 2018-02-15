import React, { Component } from 'react';
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

    for (let claim_id in claims) {
      let claim = claims[claim_id];
      let beforeText = htmlString.slice(0, claim.start_index);
      let claimText = htmlString.slice(claim.start_index, claim.end_index);
      let afterText = htmlString.slice(claim.end_index);
      claimText = `<span id=${claim_id} className="highlight type-${
        claim.type_id
      }">${claimText}</span>`;
      htmlString = `${beforeText}${claimText}${afterText}`;
    }

    return htmlString;
  }

  render() {
    return (
      <div style={style}>
        {this.props.data
          ? renderHTML(
              this.renderTextHtml(
                this.props.data.rawText,
                this.props.data.claims
              )
            )
          : null}
      </div>
    );
  }
}

export default TextField;
