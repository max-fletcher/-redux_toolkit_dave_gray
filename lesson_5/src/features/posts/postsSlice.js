// A redux state objects is split into multiple state objects. Hence, a slice is a set of reducer logic, state and actions for each feature in the app.
// E.g a blog may have separate slices for posts, comments and likes/dislikes. We will handle each of the logic of each differently so each have 
// their own slices.
// ***IMPORTANT also importing createAsyncThunk from redux toolkit. Importing createSelector so that we can return a memoized value for
// posts. Also importing createEntityAdapter so that we can return normalized values in a way that is considered the usual convention.
import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from 'date-fns'
import axios from 'axios'

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts'

// An entity adapter stores data in a normalized state so it becomes easier to fetch using thunks or RTKQuery. (See Dave Gray Redux Toolkit - 2:35:19)
// we are using the "createEntityAdapter" hook to memoize posts. We are also using a "sortComparer" function so we can sort the "posts"
// before we store them in state(which was previously done in "PostList")
const postsAdapter = createEntityAdapter({
   sortComparer: (a,b) => b.date.localeCompare(a.date)
})

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

export const updatePost = createAsyncThunk('posts/updatePost', async (initialPost) => {
   const { id } = initialPost // picking out only the id from the post data
   try {
      const response = await axios.put(`${POSTS_URL}/${id}`, initialPost) // The api is already built so that it can edit post data based on id
      return response.data
   } catch (error) {
      // console.log(error, error.message, 'from update post');
      // return error.message
      return initialPost // only for testing redux
   }
})

export const deletePost = createAsyncThunk('posts/deletePost', async (initialPost) => {
   const { id } = initialPost // picking out only the id from the post data
   try {
      const response = await axios.delete(`${POSTS_URL}/${id}`) // The api is already built so that it can delete post data based on id
      if(response.status === 200){ // Checking status code since JSONplaceholder doesn't provide anything back except an empty object on delete
         return initialPost // returns the post data if the post is deleted successfully
      }
      return `${response?.status}: ${response?.statusText}` // If status code is not 200(i.e success), return the statusText
   } catch (error) {
      return error.message
   }
})

// ***IMPORTANT using a thunk as initial state value. But now, the posts slice contains 'posts' array inside so you need to access the state with
// 'state.posts.posts' since it is nested inside 'posts' slice
// const initialState = {
//    posts: [], // posts is emty since we haven't hydrated/populated it with data it yet
//    status: 'idle', // this status can be 'idle', 'loading', 'succeeded' or 'failed'
//    error: null, // any errors that may have occured during API requests or otherwise
//    count: 0
// }

// REPLACEMENT FOR THE ABOVE COMMENTED BLOCK OF CODE
// Using the "postsAdapter" "getInitialState function to set initial state". We don't need to define an array of objects(in this case
// "posts: []") for storing the default array/data structure. It is automatically defined. The others("status", "error" and "count")
// needs to stay though.
const initialState = postsAdapter.getInitialState({
   // posts: [], // posts is empty since we haven't hydrated/populated it with data it yet
   status: 'idle', // this status can be 'idle', 'loading', 'succeeded' or 'failed'
   error: null, // any errors that may have occured during API requests or otherwise
   count: 0
})



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
      // We are no longer using "postAdded" since it is relaced with fetchPosts thunk. So it is commented out.

      // postAdded: {
      //    reducer(state, action){
      //       state.posts.push(action.payload)
      //    },
      //    prepare(title, content, userId){
      //       return{
      //          payload: {
      //             id: nanoid(),
      //             userId,
      //             title,
      //             content,
      //             date: new Date().toISOString(),
      //             reactions: {
      //                thumbsUp : 0,
      //                wow : 0,
      //                heart : 0,
      //                rocket : 0,
      //                coffee : 0
      //             }
      //          }
      //       }
      //    }
      // },

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
            // const existingPost = state.posts.find((post) => post.id === postId)
            // The above line was before we used "createEntityAdapter". This is the new syntax for using "postsAdapter.getInitialState".
            // It gets the specific post whose reaction count we wish to change.
            const existingPost = state.entities[postId]
            if(existingPost){
               existingPost.reactions[reaction]++
            }
         }
      },

      // for incrementing count
      increaseCount: {
         reducer(state, action){
            state.count = state.count + 1
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
            // state.posts = state.posts.concat(loadedPosts)

            // The above line was before we used "createEntityAdapter". This is the new syntax for using "postsAdapter.getInitialState".
            // "createEntityAdapter" has its own CRUD methods. This will update the "posts" array when the "fetchPosts" is "fulfilled".
            postsAdapter.upsertMany(state, loadedPosts)
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
            // state.posts.push(action.payload) // again, immer.js will work to make sure this is not a mutation

            // The above line was before we used "createEntityAdapter". This is the new syntax for using "postsAdapter.getInitialState".
            // "createEntityAdapter" has its own CRUD methods. This will add a new "post" to the "posts" array when the "fetchPosts" is
            // "fulfilled".
            postsAdapter.addOne(state, action.payload)
         })
         // For updating an existing post
         .addCase(updatePost.fulfilled, (state, action) => {
            // console.log(action.payload);
            // If a post with given id is not found. Axios can't catch the error where the response body is empty so we have to manually check it
            if(!action.payload?.id){
               console.log("Update could not be completed.", action.payload);
               return;
            }
            // Notice we are not appending any reactions here, since we are destructuring and passing that in the action payload
            // (i.e the reactions object that existed previously). See "onSavePostClicked" function's disaptch of updatePost.
            const { id } = action.payload
            action.payload.date = new Date().toISOString()
            // const posts = state.posts.filter(post => post.id !== id) // retrieve all other posts except the post we are editing
            // appending the new post to the old ones except the one we are editing, to make a new posts array
            // again, immer.js will work to make sure this is not a mutation
            // state.posts = [...posts, action.payload]

            // The above line was before we used "createEntityAdapter". This is the new syntax for using "postsAdapter.getInitialState".
            // "createEntityAdapter" has its own CRUD methods. This will update an existing "post" to the "posts" array when "updatePost" is
            // "fulfilled".
            postsAdapter.upsertOne(state, action.payload)
         })
         // For deleting an existing post
         .addCase(deletePost.fulfilled, (state, action) => {
            // console.log(action.payload);
            // If a post with given id is not found. Axios can't catch the error where the response body is empty so we have to manually check it
            if(!action.payload?.id){
               console.log("Delete could not be completed.", action.payload);
               return;
            }
            const { id } = action.payload
            action.payload.date = new Date().toISOString()
            const posts = state.posts.filter(post => post.id !== id) // retrieve all other posts except the post we are deleting
            // setting posts equal to the old posts except the one we are deleting
            // again, immer.js will work to make sure this is not a mutation
            // state.posts = posts

            // The above line was before we used "createEntityAdapter". This is the new syntax for using "postsAdapter.getInitialState".
            // "createEntityAdapter" has its own CRUD methods. This will delete a "post" from "posts" array with matching id when the
            // "deletePost" is "fulfilled".
            postsAdapter.removeOne(state, id)
         })
   }
})

// we need to export BOTH the reducer AND the actions to use global store properly.

// exporting the actions for this slice(mandatory)
// export const { increment, decrement, reset, incrementByAmount } = counterSlice.actions

// This is to ascertain that 'posts' inside 'state' will be exported. So if the structure of this slice ever changes, we just need to change
// the export here and everywhere we use this, will grab the right data
// export const selectAllPosts = (state) => state.posts.posts
export const getPostsStatus = (state) => state.posts.status
export const getPostsError = (state) => state.posts.error
export const getCount = (state) => state.posts.count

// commented out "export const selectAllPosts..." and "export const selectPostById..." so that we can use "getSelectors" hook provided by 
// the "createEntityAdapter" hook. It provides some selectors out of the box that can be aliased by using destructuring.
export const {
   selectAll: selectAllPosts, // alias for "selectAll" is "selectAllPosts"
   selectById: selectPostById, // alias for "selectById" is "selectPostById"
   selectIds: selectPostIds, // alias for "selectIds" is "selectPostIds"
   // We do have to pass a selector that returns the posts slice of the state
} = postsAdapter.getSelectors((state) => state.posts)

// find and return a single post
// export const selectPostById = (state, postId) =>
//    state.posts.posts.find(post => post.id === postId) // returns post that has same postId

// selectPostById doesn't memoize the value returned so anything that causes rerender will cause that function to run again. This function
// (selectPostByUser) will not do that as it returns memoized values only. The counter component we put inside the header can be used to
// demonstrate that. If we click on it and change the counter, by using react devtools "components" panel, it can be seen that the outlet and
// other components below it(e.g PostList & UserPage) re-renders, even though it shouldn't since neither "posts" nor "user" changed.

// A createSelector is basically a way to memoize redux states. It will accept one or more input functions as 1st param that contains an array of 
// functions that are dependencies (i.e the values that are returned from these functions are the dependencies) and they provide the input 
// parameters for the 2nd param, which is the called the output function. Hence, the array of dependencies must coincide with the 2nd Param's function params
// (2 for 2 in this case). So, "selectAllPosts" will provide the dependency for "posts" and "userId" will provide the dependency for "userId".
// Only if one of these 2 dependencies change, will the "selectPostsByUser" be triggered again(which prevents unnecessary re-renders).

// If we chose to, we could've replaced "selectAllPosts" with "(state) => state.posts.posts", which means the same(i.e if posts
// inside posts state changes, then "selectPostsByUser" will re-run). Using "selectAllPosts" is just a shortcut since it equals to
// "(state) => state.posts.posts".
export const selectPostsByUser = createSelector( // Returns a memoized lost of posts by a single user, unlike "selectPostById". 
   [selectAllPosts, (state, userId) => userId],
   (posts, userId) => posts.filter((post) => post.userId === userId)
)

// we removed the "postAdded" since it was replaced with "fetchPosts". We added  "increaseCount" instead that will increment count.
export const { increaseCount, reactionAdded } = postsSlice.actions

// exporting the reducer(mandatory)
export default postsSlice.reducer