import { useSelector, useDispatch } from "react-redux";
// Removed "selectALlPosts" so that we can use "selectPostIds" from "createEntityAdapter"-s "postsAdapter" instead
import { selectPostIds, getPostsStatus, getPostsError } from "./postsSlice"; // importing a bunch of states
import PostsExcerpt from "./PostsExcerpt";

// abstracting these away into PostsExcerpt
// import PostAuthor from "./PostAuthor";
// import TimeAgo from "./TimeAgo";
// import ReactionButtons from "./ReactionButtons";

const PostList = () => {
   const dispatch = useDispatch() //initializing useDispatch into a variable so we can use actions with it

   // const posts = useSelector((state) => state.posts)  //import reducer from store
   // const posts = useSelector(selectAllPosts)  //Another way to import reducer from store provided we exported a named state from the slice
   // (in this case 'postsSlice' -> export const selectAllPosts = (state) => state.posts)

   // Removed above line so that we can use "selectPostIds" from "createEntityAdapter"-s "postsAdapter" instead
   const orderedPostIds = useSelector(selectPostIds)

   const postStatus = useSelector(getPostsStatus)
   const postError = useSelector(getPostsError)

   // Block below is commented out since we are passing the posts from index.js using dispatch and fetchPosts. You can remove it altogether
   // if you wish though
   // useEffect(() => {
   //    if(postStatus === 'idle'){
   //       dispatch(fetchPosts())
   //    }
   // }, [postStatus, dispatch])

   // The slice method is needed since it returns a new array, else, it doesn't work. Its because sort() will mutate the data but redux data is 
   // immutable by nature. Since slice() returns a shallow copy, it will only return a reference to all array elements inside the JSON but sorted.

   // console.log(posts);
   console.log(orderedPostIds);

   let content
   if(postStatus === 'loading'){
      // console.log('loading');
      content = <p> "Loading..." </p>
   }else if(postStatus === 'succeeded'){
      // console.log('success', posts);
      // const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
      // content = orderedPosts.map((post) => {
      //    return( 
      //       <PostsExcerpt key={post.id} post={post} /> 
      //    )})

      // Removed above block so that we can use "selectPostIds" from "createEntityAdapter"-s "postsAdapter" instead of "selectAllPosts"
      // with "useSelector" hook
      content = orderedPostIds.map((postId) => {
         return( 
            <PostsExcerpt key={postId} postId={postId} /> 
         )})
   }else if(postStatus === 'failed') {
      // console.log('failed');
      content = <p> {postError} </p>
   }

   // console.log(posts);

   return (
      <section>
         <h2>Posts</h2>
         {content}
      </section>
   )
}

export default PostList