import React, { Component } from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';
import style from './style.css';

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
      <div id="upload">
        <div id="upload-form">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label>Upload article</label>
              <input
                type="file"
                class="form-control-file"
                ref={input => {
                  this.fileInput = input;
                }}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Upload
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Upload;
