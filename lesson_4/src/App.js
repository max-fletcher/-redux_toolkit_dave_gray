import PostList from './features/posts/PostList';
import AddPostForm from './features/posts/AddPostForm';
// import './App.css';
import SinglePostPage from './features/posts/SinglePostPage';
import EditPostForm from './features/posts/EditPostForm';
import Layout from './components/Layout';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Main page that shows all posts */}
        <Route index element={<PostList />} />

        {/* nested route */}
        <Route path="post">
          {/* /post will take user to the AddPostForm page */}
          <Route index element={<AddPostForm />} />
          {/* /post/5 will take user to the singlePostPage page where 5 is the postId */}
          <Route path=":postId" element={<SinglePostPage />} />
          {/* /edit/5 will take user to the EditPostForm page where 5 is the postId */}
          <Route path="edit/:postId" element={<EditPostForm />} />
        </Route>

      </Route>
    </Routes>
    // <div>
    //   <AddPostForm />
    //   <PostList />
    // </div>
  );
}

export default App;
