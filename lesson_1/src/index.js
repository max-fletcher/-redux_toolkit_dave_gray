import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store } from './app/store' // importing store from store folder
import { Provider } from 'react-redux'; // importing 'Provider' context from react-redux

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // wrapping the 'App' component in the 'Provider' context imported from redux with the 'store' object as a prop so it becomes globally available
  // to all components nested inside 'App'. Needs to be done for every project.
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
