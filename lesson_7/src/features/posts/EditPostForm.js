import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux"; // REMOVED useDispatch FOR RTK QUERY
import { useSelector } from "react-redux";
// import { selectPostById, updatePost, deletePost, useUpdatePostMutation, useDeletePostMtation } from "./postsSlice"; // REMOVED SOME HOOKS FOR RTK QUERY
import { selectPostById, useUpdatePostMutation, useDeletePostMutation } from "./postsSlice"; // ADDED useAddReactionMutation FOR RTK QUERY
import { useParams, useNavigate } from "react-router-dom";

import { selectAllUsers } from "../users/usersSlice";

const EditPostForm = ()=>{
   const { postId } = useParams()
   // console.log(postId)
   const navigate = useNavigate() // bind useNavigate to a variable

   // when dispatching a selector that accepts a parameter, then you need to use this syntax. In this syntax, you use a callback
   // with state as param and dispatch the selector inside the callback with that state and the params you wish to pass in.
   // Number is because the useParams hook returns a string
   const post = useSelector((state) => selectPostById(state, Number(postId)))
   console.log(post);
   const users = useSelector(selectAllUsers)

   const [title, setTitle] = useState(post?.title)
   const [content, setContent] = useState(post?.body) // remember, that the API is returning "body" as text and not content.
   const [userId, setUserId] = useState(post?.userId)

   // Replaced useDispatch with the line below for RTK QUERY. We are bringing in addNewPost as well as isLoading from the apiSlice for
   // conditional rendering
   const [updatePost, { isLoading }] = useUpdatePostMutation()
   const [deletePost] = useDeletePostMutation()

   const onTitleChanged = e => setTitle(e.target.value)
   const onContentChanged = e => setContent(e.target.value)
   //Needed to convert the user/author id to number or it doesn't show proper author in Postlist and SinglePost
   const onAuthorChanged = e => setUserId(Number(e.target.value)) 

   const canSave = Boolean(title) && Boolean(content) && Boolean(userId) && !isLoading

   const onSavePostClicked = async () => {

      console.log(Boolean(title), Boolean(content), Boolean(userId), !isLoading);

      if(canSave){
         try {
            // REMOVED DUE TO RTK QUERY
            // setrequestStatus('pending') // set local status to 'pending'
            // // dispatching "updatePost". Inside the reducer action, we are destructuring the variables since before, it was called "content". Now,
            // // its called "body". Also, redux provides an unwrap function to the returned promise that either will contain the action payload, 
            // // or will throw an error, which allows us to put this functionality in a try-catch block to begin with.
            // dispatch(updatePost({ id: post.id, title, body: content, userId, reactions: post.reactions })).unwrap()


            //  Inside the query, we are destructuring the variables since before, it was called "content". Now,
            // its called "body". Also, redux provides an unwrap function to the returned promise that either will contain the data,
            // or will throw an error, which allows us to put this functionality in a try-catch block to begin with.
            await updatePost({ id: post.id, title, body: content, userId }).unwrap()

            // Reset states to blank
            setTitle('')
            setContent('')
            setUserId('')

            // navigate to post/5 (i.e "SinglePostPage" - where 5 is the id after saving/dispatching updatePost)
            navigate(`/post/${post.id}`)

         } catch (error) {
            console.log('Failed to save post', error);
         }
      }
   }

   const onDeletePostClicked = async () => {
         try {
            // REMOVED DUE TO RTK QUERY
            // setrequestStatus('pending') // set local status to 'pending'
            // // dispatching "deletePost". Inside the reducer action, we are destructuring and sending the id only. Also, redux provides an
            // // unwrap function to the returned promise that either will contain the action payload, or will throw an error, which allows
            // // us to put this functionality in a try-catch block to begin with.
            // dispatch(deletePost({ id: post.id })).unwrap()

            await deletePost({ id: post.id }).unwrap()

            // Reset states to blank
            setTitle('')
            setContent('')
            setUserId('')

            // navigate to home
            navigate(`/`)

         } catch (error) {
            console.log('Failed to delete post', error);
         }
   }

   // return JSX with message "Post Not Found if the post we are trying to update doesn't exist"
   if(!post){
      return(
         <section>
            <h2>Post not found!</h2>
         </section>
      )
   }

   // Default return which is the edit form
   return(
      <section>
         <h2>Edit Post</h2>
         <form>
            <label htmlFor="postTitle">Post title:</label>
            <input type="text" id="postTitle" name="postTitle" value={title} onChange={onTitleChanged} />

            <label htmlFor="postAuthor">Author:</label>
            <select id="postAuthor" defaultValue={userId} onChange={onAuthorChanged}>
            <option value="" disabled>Select Author</option>
            {
               users.map((user) => (
                  <option key={user.id} value={user.id}>
                     {user.name}
                  </option>
                  )
               )
            }
            </select>

            <label htmlFor="postContent">Post Content:</label>
            <textarea id="postContent" name="postContent" value={content} onChange={onContentChanged} />
            {/* If all three valeus are non-empty, then remove disable. In other words, ff any single value is empty, apply disable property. */}
            {/* When you are not using addNewPost Thunk */}
            {/* <button type="button" onClick={onSavePostClicked} disabled={!title || !content || !userId}>Save Post</button > */}
            {/* Same as above but disabled property logic abstractd away to a separate variable */}
            {/* <button type="button" onClick={onSavePostClicked} disabled={canSave}>Save Post</button > */}
            <button type="button" onClick={onSavePostClicked} disabled={!canSave}>Update Post</button>
            <button className="deleteButton" type="button" onClick={onDeletePostClicked}>Delete Post</button>
         </form>
      </section>
   )
}

export default EditPostForm