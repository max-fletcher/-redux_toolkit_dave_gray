import { useState } from "react";
import React from 'react'
import { postAdded } from "./postsSlice"; // importing the action 'postAdded' from postsSlice
// import { nanoid } from "@reduxjs/toolkit"; //nanoid module from redux-toolkit helps to generate a random ID
import { useDispatch, useSelector } from "react-redux"; // importing dispatch and selector hook to fire actions that are defined in the slices
import { selectAllUsers } from "../users/usersSlice";

const AddPostForm = () => {
   const dispatch = useDispatch() // storing dispatch hook in a varaible so we can use it to fire actions that are defined in the slices
   const [title, setTitle] = useState('')
   const [content, setContent] = useState('')
   const [userId, setUserId] = useState('')

   const users = useSelector(selectAllUsers)
   // console.log(users);

   const onSavePostClicked = () => {
      if(title && content && userId){
         // dispatching the 'postAdded' action with a payload of object{ id: nanoid(), title, content }
         // dispatch(
         //    postAdded({
         //       id: nanoid(),
         //       title,
         //       content
         //    })
         // )

         // block of code to replace the above 8 lines if you wish to abstract away some logic to 'prepare' callback inside dispatch of postAdded. There we
         // are setting the id using nanoid from redux-toolkit
         dispatch(
            postAdded(title, content, userId)
         )

         setTitle('')
         setContent('')
         setUserId('')
      }
   }

   const onTitleChange = (e) => {
      setTitle(e.target.value)
   }
   const onContentChange = (e) => {
      setContent(e.target.value)
   }
   const onAuthorChange = (e) => {
      setUserId(e.target.value)
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
            <textarea id="postContent" name="postContent" value={content} onChange={onContentChange} />
            {/* If all three valeus are non-empty, then remove disable. In other words, ff any single value is empty, apply disable property. */}
            <button type="button" onClick={onSavePostClicked} disabled={!title || !content || !userId}>Save Post</button >
         </form>
      </section>
   )
}

export default AddPostForm