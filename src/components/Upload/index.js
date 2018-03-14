import React, { Component } from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = { data: '' };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    let file = this.fileInput.files[0].name;
    this.setState({ data: file });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Upload article:
          <input
            type="file"
            ref={input => {
              this.fileInput = input;
            }}
          />
        </label>
        <br />
        <button type="submit">Upload</button>
      </form>
    );
  }
}

export default Upload;
