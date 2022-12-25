import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { ApiProvider } from '@reduxjs/toolkit/query/react' //importing provider context for RTKQuery so the DOM tree can get access to it
import { apiSlice } from './features/api/apiSlice' //importing apiSlice so it can be passed down the DOM tree

ReactDOM.createRoot(document.getElementById('root'))
  .render(
    <React.StrictMode>
      {/* Wrapping the App component in the provider context and passing down "apiSlice" so all components can get access to
        that and any provided slices, if they import it in that component that is */}
      <ApiProvider api={apiSlice}>
        <App />
      </ApiProvider>
    </React.StrictMode>
  );