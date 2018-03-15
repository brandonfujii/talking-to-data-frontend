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
    event.preventDefault();
    /*
    let file = this.fileInput.files[0];
    var reader = new fileReader();
    reader.onload = function(event){

    }
    this.setState({ data: file });
    */
    this.props.handleUpload(event);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label>
            Upload article:
            <input
              type="file"
              class="form-control-file"
              ref={input => {
                this.fileInput = input;
              }}
            />
          </label>
          <br />
          <button type="submit">Upload</button>
        </div>
      </form>
    );
  }
}

export default Upload;
