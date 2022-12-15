// A redux state objects is split into multiple state objects. Hence, a slice is a set of reducer logic, state and actions for each feature in the app.
// E.g a blog may have separate slices for posts, comments and likes/dislikes. We will handle each of the logic of each differently so each have 
// their own slices.
// ***IMPORTANT also importing createAsyncThunk from redux toolkit
import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import { sub } from 'date-fns'
import axios from 'axios'

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts'

// Redux works synchronously so anything asynchronous in redux must happen its middleware. And the most common approach is a "thunk" middleware.
// It can be imported and dispatched from a component using the "useDispatch" hook. (See PostList.js for how "fetchPosts" is used.)
// a createAsyncThunk accepts 2 params. 1st one is a prefix used for the generated action type. The 2nd one is a payload creator callback that will
// either accept a promise and return some data(tha can be stored in a variable if you like), or reject a promise and return an error.
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
   try {
      const response = await axios.get(POSTS_URL)
      return response.data
   } catch (error) {
      return error.message
   }
})

// Redux works synchronously so anything asynchronous in redux must happen its middleware. And the most common approach is a "thunk" middleware.
// It can be imported and dispatched from a component using the "useDispatch" hook.
// a createAsyncThunk accepts 2 params. 1st one is a prefix used for the generated action type. The 2nd one is a payload creator callback that will
// either accept a promise and return some data(tha can be stored in a variable if you like), or reject a promise and return an error.
// This thunk is making a POST request to the POSTS_URL NOT A GET.
export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost) => {
   try {
      const response = await axios.post(POSTS_URL, initialPost)
      return response.data
   } catch (error) {
      return error.message
   }
})

// ***IMPORTANT using a thunk as initial state value. But now, the posts slice contains 'posts' array inside so you need to access the state with
// 'state.posts.posts' since it is nested inside 'posts' slice
const initialState = {
   posts: [], // posts is emty since we haven't hydrated/populated it with data it yet
   status: 'idle', // this status can be 'idle', 'loading', 'succeeded' or 'failed'
   error: null
}

// contains reducer. 1st params in the name(used to call actions for this slice using the syntax state.?name?.action. In this case, an example is
// state.counter.increment. However, remember that we can choose to not call it in a component and instead export it from the slice itself with a
// designated name. See below), 2nd param is the initial state data(may be number, string, object etc but object is preferred),
// and 3rd param are the actions(see below for more info). Don't forget to export it(mandatory)
const postsSlice = createSlice({
   name: 'posts',
   initialState,
   reducers: {
      // postAdded(state, action){
      //    state.push(action.payload)
      // }
      // This is a replacement for the 3 lines above. It is how you abstract the logic from inside a component into redux. The 'reducer'
      // callback(where the state is  persisted to store store) will run after 'prepare' callback(where the data is pre-processed before storing).
      postAdded: {
         reducer(state, action){
            state.posts.push(action.payload)
         },
         prepare(title, content, userId){
            return{
               payload: {
                  id: nanoid(),
                  userId,
                  title,
                  content,
                  date: new Date().toISOString(),
                  reactions: {
                     thumbsUp : 0,
                     wow : 0,
                     heart : 0,
                     rocket : 0,
                     coffee : 0
                  }
               }
            }
         }
      },

      // reactionAdded(state, action) {
      //    const { postId, reaction } = action.payload
      //    const existingPost = state.posts.find((post) => post.id === postId)
      //    if(existingPost){
      //       existingPost.reactions[reaction]++
      //    }
      // }

      // A reducer action can also be declared using the syntax above. Though its prefereable to stick to the convention below.
      reactionAdded: {
         reducer(state, action){
            const { postId, reaction } = action.payload
            const existingPost = state.posts.find((post) => post.id === postId)
            if(existingPost){
               existingPost.reactions[reaction]++
            }
         }
      }

   },

   // Sometimes a slice needs to responsd to other actions that were not defined as part of the slice's reducers. This extra reducer will
   // run in response to other actions that were not defined as part of the slice's reducers(i.e status of an axios request).
   // The action.payload will contain data that the promise returns.
   extraReducers: (builder) => {
      // the builder parameter is an object that will allow us to define additional case-based reducers that will run in response to the
      // actions defined outside of the slice

         // remember that axios sends different statuses based on its fetch lifecycle. We are using a switch case of sorts to define what to do 
         // for each case dispatched/returned to us by the fetchPosts thunk promise status.
         builder
         .addCase(fetchPosts.pending, (state, action) => {
            state.status = 'loading'
         })
         .addCase(fetchPosts.fulfilled, (state, action) => {
            state.status = 'succeeded'
            // Adding date and reactions since the posts from jsonplacehonder doesn't have those
            let min = 1
            const loadedPosts = action.payload.map((post) => {
               post.date = sub(new Date(), { minutes: min++ }).toISOString()
               post.reactions = {
                  thumbsUp : 0,
                  wow : 0,
                  heart : 0,
                  rocket : 0,
                  coffee : 0
               }

               return post
            })

            // add any fetched data to the posts array inside the state
            // immer.js makes sure it is not a mutation since states inside redux are immutable(look up immutability and its problems in js)
            state.posts = state.posts.concat(loadedPosts)
         })
         .addCase(fetchPosts.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
         })
         // For adding new post
         .addCase(addNewPost.fulfilled, (state, action) => {
            action.payload.userId = Number(action.payload.userId)
            action.payload.date = new Date().toISOString()
            action.payload.reactions = {
               thumbsUp : 0,
               wow : 0,
               heart : 0,
               rocket : 0,
               coffee : 0
            }
            console.log(action.payload);
            state.posts.push(action.payload) // again, immer.js will work to make sure this is not a mutation

         })

   }
})

// we need to export BOTH the reducer AND the actions to use global store properly.

// exporting the actions for this slice(mandatory)
// export const { increment, decrement, reset, incrementByAmount } = counterSlice.actions

// This is to ascertain that 'posts' inside 'state' will be exported. So if the structure of this slice ever changes, we need to change the export
// here and everywhere we use this, will grab the right data
export const selectAllPosts = (state) => state.posts.posts
export const getPostsStatus = (state) => state.posts.status
export const getPostsError = (state) => state.posts.error

export const { postAdded, reactionAdded } = postsSlice.actions

// exporting the reducer(mandatory)
export default postsSlice.reducer