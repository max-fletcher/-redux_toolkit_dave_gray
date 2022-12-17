import { useSelector } from "react-redux";
import { selectPostById } from "./postsSlice";

import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";

import { useParams, Link } from "react-router-dom";

const SinglePostPage = () => {
   // retrieve postId via react router route param
   const { postId } = useParams();

   // when dispatching a selector that accepts a parameter, then you need to use this syntax. In this syntax, you use a callback
   // with state as param and dispatch the selector inside the callback with that state and the params you wish to pass in.
   // Number is because the useParams hook returns a string
   const post = useSelector((state) => selectPostById(state, Number(postId)))

   // console.log(post, 'excerpt');

   if(!post){
      return(
         <section>
            <h2> No Post Found! </h2>
         </section>
      )
   }

   return (
      <article>
         <h3> {post.title} </h3>
         <p> {post.body} </p>
         <p className="postCredit">
            <Link to={`/post/edit/${post.id}`}>Edit Post</Link>
            <PostAuthor userId={post.userId} />
            <TimeAgo timestamp={post.date} />
         </p>
         <ReactionButtons post={post} />
      </article>
   )
}

export default SinglePostPage