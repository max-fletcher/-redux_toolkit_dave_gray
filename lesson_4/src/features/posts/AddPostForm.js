import { useState } from "react";
import React from 'react'
// import { postAdded } from "./postsSlice"; // importing the action 'postAdded' from postsSlice
import { addNewPost } from "./postsSlice"; // replacing above action 'postAdded'(from postsSlice) with "addNewPost" thunk
// import { nanoid } from "@reduxjs/toolkit"; //nanoid module from redux-toolkit helps to generate a random ID
import { useDispatch, useSelector } from "react-redux"; // importing dispatch and selector hook to fire actions that are defined in the slices
import { selectAllUsers } from "../users/usersSlice";

const AddPostForm = () => {
   const dispatch = useDispatch() // storing dispatch hook in a varaible so we can use it to fire actions that are defined in the slices
   const [title, setTitle] = useState('')
   const [content, setContent] = useState('')
   const [userId, setUserId] = useState('')
   //instead of using status from axios, we are using our own state as status(maybe bcuz its a post request)
   const [addRequestStatus, setAddRequestStatus] = useState('idle')

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
   const canSave = Boolean(title) && Boolean(content) && Boolean(userId) && addRequestStatus === 'idle'

   const onSavePostClicked = () => {
      // OLD(For "postAdded" reducer action)
      // if(title && content && userId){
      //    // dispatching the 'postAdded' action with a payload of object{ id: nanoid(), title, content }
      //    // dispatch(
      //    //    postAdded({
      //    //       id: nanoid(),
      //    //       title,
      //    //       content
      //    //    })
      //    // )

      //    // block of code to replace the above 8 lines if you wish to abstract away some logic to 'prepare' callback inside dispatch of postAdded. There we
      //    // are setting the id using nanoid from redux-toolkit
      //    dispatch(
      //       postAdded(title, content, userId)
      //    )

      //    setTitle('')
      //    setContent('')
      //    setUserId('')
      // }
      console.log(Boolean(title), Boolean(content), Boolean(userId), addRequestStatus === 'idle');

      if(canSave){
         try {
            setAddRequestStatus('pending') // set "status" to pending
            // dispatching "addNewPost". Inside the reducer action, we are destructuring the variables since before, it was called "content". Now,
            // its called "body". Also, redux provides an unwrap function to the returned promise that either will contain the action payload, 
            // or will throw an error, which allows us to put this functionality in a try-catch block to begin with.
            dispatch(addNewPost({title, body: content, userId})).unwrap()

            setTitle('')
            setContent('')
            setUserId('')
         } catch (error) {
            console.error('Failed to save the post', error);
         }
         finally{
            setAddRequestStatus('idle') // set request status to "idle" regardless of the axios request succeeding or failing
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