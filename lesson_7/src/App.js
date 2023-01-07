// For posts routes
import PostList from './features/posts/PostList';
import AddPostForm from './features/posts/AddPostForm';
// import './App.css';
import SinglePostPage from './features/posts/SinglePostPage';
import EditPostForm from './features/posts/EditPostForm';

// For user routes
import UserData from './features/users/UserData';
import UserList from './features/users/UserList';

import Layout from './components/Layout'; //import layout for react router to use
import { Routes, Route, Navigate } from 'react-router-dom'; //import hooks for routing

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Main page that shows all posts */}
        <Route index element={<PostList />} />

        {/* nested route */}
        <Route path="user">
          {/* /post will take user to the AddPostForm page */}
          <Route index element={<UserList />} />
          {/* /user/5 will take user to the UserData page where 5 is the userId */}
          <Route path=":userId" element={<UserData />} />
        </Route>

        {/* nested route */}
        <Route path="post">
          {/* /post will take user to the AddPostForm page */}
          <Route index element={<AddPostForm />} />
          {/* /post/5 will take user to the SinglePostPage page where 5 is the postId */}
          <Route path=":postId" element={<SinglePostPage />} />
          {/* /edit/5 will take user to the EditPostForm page where 5 is the postId */}
          <Route path="edit/:postId" element={<EditPostForm />} />
        </Route>

        {/* This is a catch-all if a route is not found. Can be replaced with a 404 page. Will navigate to home page if the route is
          not found. Also, the replace is flag is used which replaces the bad history with '/' which is a good history. */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Route>
    </Routes>
    // <div>
    //   <AddPostForm />
    //   <PostList />
    // </div>
  );
}

export default App;
