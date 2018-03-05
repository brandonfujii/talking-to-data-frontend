/* Pupper is a wrapper class for isomorphic fetch */
import config from 'config';

require('es6-promise').polyfill();
require('isomorphic-fetch');

const appendQueryParams = (path, queryParams) => {
  const e = encodeURIComponent;
  const paramStr = Object.keys(queryParams)
    .map(key => `${e(key)}=${e(queryParams[key])}`)
    .join('&');

  const joinedBy = path.indexOf('?') > -1 ? '&' : '?';

  return `${path}${joinedBy}${paramStr}`;
};

const getUrl = (path, queryParams) => {
  return queryParams ? appendQueryParams(path, queryParams) : path;
};

const handleResponse = response => {
  if (!response.ok) {
    return response.json().then(err => err);
  }

  return response.json();
};

const handleError = err => {
  if (config.NODE_ENV === 'development') {
    console.error(err);
  }
};

class Pupper {
  constructor(serverAddress) {
    this.serverAddress = serverAddress || config.SERVER_ADDR;
    this.defaultHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };
  }

  request(method, route, options = {}) {
    const path = `${this.serverAddress}${route}`;
    const headers = {
      ...this.defaultHeaders,
      ...options.headers
    };

    const opts = Object.assign(options, {
      method,
      headers: new Headers(headers),
      body: method !== 'GET' ? JSON.stringify(options.body) : null
    });

    return fetch(getUrl(path, opts.queryParams), opts);
  }

  get(route, options = {}) {
    return this.request('GET', route, options)
      .then(handleResponse)
      .catch(handleError);
  }

  post(route, options = {}) {
    console.log('POST at', route);
    return this.request('POST', route, options)
      .then(handleResponse)
      .catch(handleError);
  }

  put(route, options = {}) {
    return this.request('PUT', route, options)
      .then(handleResponse)
      .catch(handleError);
  }

  delete(route, options = {}) {
    return this.request('DELETE', route, options)
      .then(handleResponse)
      .catch(handleError);
  }
}

export default new Pupper();
