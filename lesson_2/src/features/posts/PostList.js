import { useSelector } from "react-redux";
import { selectAllPosts } from "./postsSlice";
import PostAuthor from "./PostAuthor";

const PostList = () => {
   // const posts = useSelector((state) => state.posts)  //import reducer from store
   const posts = useSelector(selectAllPosts)  //Another way to import reducer from store provided we exported a named state from the slice(in this case
   // 'postsSlice' -> export const selectAllPosts = (state) => state.posts)

   const renderedPosts = posts.map((post) => {

      // This renders JSX. Instead of writing this directly in the return of this component, you can abstract it away like this into a separate
      //  function and call it inside the return function of a component
      return (
         <article key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content.substring(0,100)}</p>
            <p className="postCredit">
               <PostAuthor userId={post.userId} />
            </p>
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