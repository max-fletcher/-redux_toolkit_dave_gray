import { useState } from "react";
// import { postAdded } from "./postsSlice"; // importing the action 'postAdded' from postsSlice
// import { addNewPost } from "./postsSlice"; // replacing above action 'postAdded'(from postsSlice) with "addNewPost" thunk // Removed for RTK QUERY
// import { nanoid } from "@reduxjs/toolkit"; //nanoid module from redux-toolkit helps to generate a random ID
import { useSelector } from "react-redux"; // importing dispatch and selector hook to fire actions that are defined in the slices
import { selectAllUsers } from "../users/usersSlice";

import { useNavigate } from "react-router-dom";

import { useAddNewPostMutation } from "./postsSlice";

const AddPostForm = () => {
   // Replaced useDispatch with the line below for RTK QUERY. We are bringing in addNewPost as well as isLoading from the apiSlice for
   // conditional rendering
   const [addNewPost, { isLoading }] = useAddNewPostMutation()

   const navigate = useNavigate() // bind useNavigate to a variable

   const [title, setTitle] = useState('')
   const [content, setContent] = useState('')
   const [userId, setUserId] = useState('')
   //instead of using status from axios, we are using our own state as status(maybe bcuz its a post request)
   // const [addRequestStatus, setAddRequestStatus] = useState('idle') // Removed for RTK QUERY

   const users = useSelector(selectAllUsers)
   // console.log(users);

   const onTitleChange = (e) => {
      setTitle(e.target.value)
   }
   const onContentChange = (e) => {
      setContent(e.target.value)
   }
   const onAuthorChange = (e) => {
      setUserId(e.target.value)
   }

   // OLD(For "postAdded" reducer action)
   // const canSave = !Boolean(title) && !Boolean(content) && !Boolean(userId)
   // NEW(For "addNewPost" thunk. Its the same. Just has an added logic of addRequestStatus === 'idle')
   // const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle'
   const canSave = Boolean(title) && Boolean(content) && Boolean(userId) && !isLoading

   // Added async here for RTK QUERY
   const onSavePostClicked = async () => {

      console.log(Boolean(title), Boolean(content), Boolean(userId), !isLoading);

      if(canSave){
         try {
            // REMOVED DUE TO RTK QUERY
            // setAddRequestStatus('pending') // set "status" to pending
            // // dispatching "addNewPost". Inside the reducer action, we are destructuring the variables since before, it was called "content". Now,
            // // its called "body". Also, redux provides an unwrap function to the returned promise that either will contain the action payload, 
            // // or will throw an error, which allows us to put this functionality in a try-catch block to begin with.
            // dispatch(addNewPost({title, body: content, userId})).unwrap()

            // Inside the query, we are destructuring the variables since before, it was called "content". Now,
            // its called "body". Also, redux provides an unwrap function to the returned promise that either will contain the data,
            // or will throw an error, which allows us to put this functionality in a try-catch block to begin with.
            await addNewPost({ title, body: content, userId }).unwrap()

            setTitle('')
            setContent('')
            setUserId('')
            navigate(`/`)
         } catch (error) {
            console.error('Failed to save the post', error);
         }
      }
   }

   // If you want to render the options in a separate function.
   // const usersOptions = {
   //       users.map((user) => ( // returns JSX
   //       <option key={user.id} value={user.id}>
   //          {user.name}
   //       </option>
   //    ))
   // }

   return (
      <section>
         <h2>Add a New Post</h2>
         <form>
            <label htmlFor="postTitle">Post Title:</label>
            <input type="text" id="postTitle" name="postTitle" value={title} onChange={onTitleChange} />

            <label htmlFor="postAuthor">Author:</label>
            <select id="postAuthor" value={userId} onChange={onAuthorChange}>
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
            <textarea id="postContent" name="postContent" value={content} onChange={onContentChange} />
            {/* If all three valeus are non-empty, then remove disable. In other words, ff any single value is empty, apply disable property. */}
            {/* When you are not using addNewPost Thunk */}
            {/* <button type="button" onClick={onSavePostClicked} disabled={!title || !content || !userId}>Save Post</button > */}
            {/* Same as above but disabled property logic abstractd away to a separate variable */}
            {/* <button type="button" onClick={onSavePostClicked} disabled={canSave}>Save Post</button > */}
            <button type="button" onClick={onSavePostClicked} disabled={!canSave}>Save Post</button>
         </form>
      </section>
   )
}

export default AddPostForm