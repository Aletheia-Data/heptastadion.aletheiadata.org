import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

require('dotenv').config()

let version = `
  ********************************
  ********************************
  ***** SEARCH ALETHEIADATA ******
  ** ENDPOINT: ${process.env.REACT_APP_ADMIN_ENDPOINT} *******************
  ** VERSION: ${process.env.REACT_APP_API_VERSION} *******************
  ** RAPID_API_ENDPOINT: ${process.env.REACT_APP_RAPID_API_ENDPOINT} ****************
  ********************************
  ********************************
  `;

  console.log(version);

if (window.location.host !== 'localhost:3000'){
  // console.log = function() {};
  // console.warn = function() {};
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
