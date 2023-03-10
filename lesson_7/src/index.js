import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store } from './app/store';
import { Provider } from 'react-redux'
import { fetchUsers } from './features/users/usersSlice'; // importing fetchUsers from usersSlice
// import { fetchPosts } from './features/posts/postsSlice'; // importing fetchUsers from postsSlice. This replaces useeffect in PostList
import { extendedApiSlice } from './features/posts/postsSlice'; // Replacing above line with this to use RTK QUERY when the app loads/mounts.

import { BrowserRouter } from 'react-router-dom';

// triggering the function so that users are fetched when the app loads/mounts. This is a substitute for using the useDispatch()
// hook inside a component's useEffect.
store.dispatch(fetchUsers())
// triggering the function so that users are fetched when the app loads/mounts. This is a substitute for using the useDispatch()
// hook inside a component's useEffect. This replaces useeffect in PostList since that causes the post in single post to disappear on refresh
// store.dispatch(fetchPosts())
store.dispatch(extendedApiSlice.endpoints.getPosts.initiate()) // Replacing above line with this to use RTK QUERY when the app loads/mounts.

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      {/* nesting App compoonent inside BrowserRouter */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
