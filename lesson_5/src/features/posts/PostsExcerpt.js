import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
import { Link } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectPostById } from "./postsSlice";

// import React from "react"; // one way to memoize data using React, let PostsExcerpt, and React.memo()

// let PostsExcerpt = ({post}) => { // one way to memoize data using React, let PostsExcerpt, and React.memo()

const PostsExcerpt = ({postId}) => {

   // when dispatching a selector that accepts a parameter, then you need to use this syntax. In this syntax, you use a callback
   // with state as param and dispatch the selector inside the callback with that state and the params you wish to pass in.
   const post = useSelector((state) => selectPostById(state, postId))

   // console.log(post, 'excerpt');

   return (
      <article>
         <h3>{post.title}</h3>
         <p className="excerpt">{post.body.substring(0,75)}...</p>
         <p className="postCredit">
            <Link to={`post/${post.id}`}> View Post </Link>
            <PostAuthor userId={post.userId} />
            <TimeAgo timestamp={post.date} />
         </p>
         <ReactionButtons post={post} />
      </article>
   )
}

// PostsExcerpt = React.memo(PostsExcerpt) // one way to memoize data using React, let PostsExcerpt, and React.memo()

export default PostsExcerpt