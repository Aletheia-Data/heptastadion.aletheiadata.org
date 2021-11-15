import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

let version = `
  ********************************
  ********************************
  ***** SEARCH ALETHEIADATA ******
  ************ v${'0.0.1'} **********
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
