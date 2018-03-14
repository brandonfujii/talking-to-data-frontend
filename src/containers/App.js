import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Document from 'components/Document';

import { uploadArticleByUser } from 'modules/article';

class App extends Component {
  render() {
    return (
      <div className="App">
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
          integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
          crossOrigin="anonymous"
        />
        <header className="App-header">
          <Document {...this.props} />
        </header>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  articles: []
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      uploadArticleByUser
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(App);
