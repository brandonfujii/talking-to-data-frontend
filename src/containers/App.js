import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Document from 'components/Document';

import { uploadArticleByUser } from 'modules/article';

class App extends Component {
  componentDidMount() {
    console.log('componentDidMount');
    uploadArticleByUser(
      'c3467c16-0ac9-4e49-988e-21091e0ab492',
      'For a brief moment in December 2017, the international spotlight shined on the case of 92 deportees who were on an Immigration and Customs Enforcement-chartered flight to Somalia. Most such flights unload their human cargo once they land, but this flight, for logistical reasons, returned home — and brought witnesses back with it.'
    );
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Document />
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
