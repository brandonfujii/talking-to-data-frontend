// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { ConnectedRouter } from 'react-router-redux';
import { persistor, history } from './store';
import { PersistGate } from 'redux-persist/integration/react';

class AppProvider extends Component {
  constructor(props) {
    super(props);
    this.state = { rehydrated: false };
  }

  componentWillMount() {
    const options = {};

    persistStore(this.props.store, options, () => {
      this.setState({ rehydrated: true });
    });
  }

  render() {
    if (!this.state.rehydrated) {
      return null;
    }

    return (
      <Provider store={this.props.store}>
        <PersistGate loading={null} persistor={persistor}>
          <ConnectedRouter history={history}>
            {this.props.children}
          </ConnectedRouter>
        </PersistGate>
      </Provider>
    );
  }
}

AppProvider.propTypes = {
  store: PropTypes.object.isRequired,
  children: PropTypes.node
};

export default AppProvider;
