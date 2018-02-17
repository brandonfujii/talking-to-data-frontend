// @flow

import React, { Component } from 'react';
import Document from './components/Document';

class App extends Component {
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

export default App;
