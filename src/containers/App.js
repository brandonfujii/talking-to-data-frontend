import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Document from 'components/Document';

import { uploadArticleByUser } from 'modules/article';

class App extends Component {
  render() {
    return (
      <div className="App">
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
