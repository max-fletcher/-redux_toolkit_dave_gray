import { useSelector } from "react-redux";
import { selectAllPosts } from "./postsSlice";
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";

const PostList = () => {
   // const posts = useSelector((state) => state.posts)  //import reducer from store
   const posts = useSelector(selectAllPosts)  //Another way to import reducer from store provided we exported a named state from the slice(in this case
   // 'postsSlice' -> export const selectAllPosts = (state) => state.posts)

   // The slice method is needed since it returns a new array, else, it doesn't work
   const orderedPosts = posts.slice().sort((a,b) => b.date.localeCompare(a.date))

   // console.log(orderedPosts);

   // const renderedPosts = posts.map((post) => {

   const renderedPosts = orderedPosts.map((post) => {

      // console.log(post);

      // This renders JSX. Instead of writing this directly in the return of this component, you can abstract it away like this into a separate
      //  function and call it inside the return function of a component
      return (
         <article key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content.substring(0,100)}</p>
            <p className="postCredit">
               <PostAuthor userId={post.userId} />
               <TimeAgo timestamp={post.date} />
            </p>
            <ReactionButtons post={post} />
         </article>
      )
   })

   return (
      <section>
         <h2>Posts</h2>
         {renderedPosts}
      </section>
   )
}

export default PostList