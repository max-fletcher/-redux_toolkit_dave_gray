import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPostById, updatePost } from "./postsSlice";
import { useParams, useNavigate } from "react-router-dom";

import { selectAllUsers } from "../users/usersSlice";

const EditPostForm = ()=>{
   const { postId } = useParams()

   console.log(postId);

   const navigate = useNavigate()

   const post = useSelector((state) => selectPostById(state, Number(postId)))
   const users = useSelector(selectAllUsers)

   const [title, setTitle] = useState(post?.title)
   const [content, setContent] = useState(post?.body) // remember, that the API is returning "body" as text and not content.
   const [userId, setUserId] = useState(post?.userId)
   const [requestStatus, setrequestStatus] = useState('idle')

   const dispatch = useDispatch()

   const onTitleChanged = e => setTitle(e.target.value)
   const onContentChanged = e => setContent(e.target.value)
   const onAuthorChanged = e => setUserId(e.target.value)

   const canSave = Boolean(title) && Boolean(content) && Boolean(userId) && requestStatus === 'idle'

   const onSavePostClicked = () => {

      console.log(Boolean(title), Boolean(content), Boolean(userId), requestStatus === 'idle');

      if(canSave){
         try {
            setrequestStatus('pending') // set local status to 'pending'
            // dispatching "updatePost". Inside the reducer action, we are destructuring the variables since before, it was called "content". Now,
            // its called "body". Also, redux provides an unwrap function to the returned promise that either will contain the action payload, 
            // or will throw an error, which allows us to put this functionality in a try-catch block to begin with.
            dispatch(updatePost({ id: post.id, title, body: content, userId, reactions: post.reactions })).unwrap()

            // Reset states to blank
            setTitle('')
            setContent('')
            setUserId('')

            // navigate to post/5 (i.e "SinglePostPage" - where 5 is the id after saving/dispatching updatePost)
            navigate(`/post/${post.id}`)

         } catch (error) {
            console.log('Failed to save post', error);
         }
         finally{
            setrequestStatus('idle') // set local status to 'pending'
         }
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
         </form>
      </section>
   )
}

export default EditPostForm