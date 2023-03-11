import { useSelector } from "react-redux"
import { selectUserById } from "./usersSlice"
// import { selectAllPosts, selectPostsByUser } from "../posts/postsSlice" // REMOVED FOR RTK QUERY
import { Link, useParams } from "react-router-dom"
import { useGetPostsByUserIdQuery } from "../posts/postsSlice"  // SELECTOR RTK QUERY
import PostsExcerpt from "../posts/PostsExcerpt"

const UserData = () => {

   const { userId } = useParams()

   // when dispatching a selector that accepts a parameter, then you need to use this syntax. In this syntax, you use a callback
   // with state as param and dispatch the selector inside the callback with state as 1st param and additional params you wish to pass in.
   // The state contains the current reducer state that comes from that slice. SO for this case, it contains postsSlice's current state.
   // Number is because the useParams hook returns a string
   const user = useSelector((state) => selectUserById(state, Number(userId)))

   // // returns only posts that have matching userId
   // const postsForUser = useSelector(
   //    (state) => {
   //       // fetch all posts from posts slice. Remember, if you the callback syntax, then you MUST pass the state into the selector
   //       // If the callback syntax was not used, only calling the function would do (i.e "selectAllPost" and not "selectAllPost(state)".
   //       const allPosts = selectAllPosts(state)
   //       // returns only posts that have matching userId i.e belongs to that author/user
   //       return allPosts.filter(post => post.userId === Number(userId))
   //    }
   // )

   // Replaced above block with block below to return momoized values using "selectPostsByUser" defined inside postsSlice
   // const postsForUser = useSelector((state) => selectPostsByUser(state, Number(userId)))  // REMOVED FOR RTK QUERY

   const {
      data: postsForUser,
      isLoading,
      isSuccess,
      isError,
      error
   } = useGetPostsByUserIdQuery(userId)

   // REMOVED FOR RTK QUERY
   // const postTitles = postsForUser.map(
   //    (post) => {
   //       return(
   //          <li key={post.id}>
   //             <Link to={`/post/${post.id}`}>{post.title}</Link>
   //          </li>
   //       )
   //    }
   // )

   let content;
   if(isLoading){
      content = <p> Loading... </p>
   }
   else if(isSuccess){
      const { ids, entities } = postsForUser // destructuring ids and entities to get them separately
      content = ids.map( id => ( // looping and constructing the content if data is fetched successfully
         <li key={id}>
            <Link to={`/posts/${id}`}>{entities[id].title}</Link>
         </li>
      ))
   }
   else if(isError){
      content = <p>{error}</p>
   }

   return (
      <section>
         <h2>{user?.name}</h2>
         {/* <ol>{postTitles}</ol> */}
         {/* ABOVE LINE REMOVED FOR RTK QUERY */}
         <ol>{content}</ol>
      </section>
   )
}

export default UserData