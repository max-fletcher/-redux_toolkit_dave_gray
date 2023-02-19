// ***IMPORTANT Importing createSelector so that we can return a memoized value for users and
// posts. Also importing createEntityAdapter so that we can return normalized values in a way that is considered the usual conventon.
import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from 'date-fns'

// Importing apiSlice that uses RTK QUERY
import { apiSlice } from "../api/apiSlice";

// An entity adapter stores data in a normalized state so it becomes easier to fetch using thunks or RTKQuery. (See Dave Gray Redux Toolkit - 2:35:19)
// we are using the "createEntityAdapter" hook to memoize posts. We are also using a "sortComparer" function so we can sort the "posts"
// before we store them in state(which was previously done in "PostList")
const postsAdapter = createEntityAdapter({
   sortComparer: (a,b) => b.date.localeCompare(a.date)
})

// REMOVED ALL POSTS THUNKS TO IMPLEMENT EXTENDED RTK QUERIES INSTEAD

// Using the "postsAdapter" "getInitialState function to set initial state". We don't need to define an array of objects(in this case
// "posts: []") for storing the default array/data structure. It is automatically defined. We are not defining 'status', 'error' and
// 'count' for this instance since some/all of it will be defined by RTK QUERY.
const initialState = postsAdapter.getInitialState()

// REPLACING POSTSSLICE SO WE CAN USE EXTENDED RTK QUERY INSTEAD
// importing apiSlice from 'features/api/apiSlice' and then injecting endpoints to it from here instead of defining it there.
export const extendedApiSlice = apiSlice.injectEndpoints({
   endpoints: (builder) => ({
      getPosts: builder.query({
         // hit the '/posts' endpoint provided by json-server
         query: () => '/posts',
         // transform the data before storing/cacheing it. We are looping over the data and adding a date to every one of them. But we
         // we are incrementing that time by 1 min as we loop. We are also appending reactions to every post as well.
         transformResponse: (responseData) => {
            let min = 1
            // loadedPosts is a new array of posts that we are getting as we loop over the response data. We are adding 'time' and
            // 'reactions' as stated above.
            const loadedPosts = responseData.map((post) => {
               // if a post doesn't have date appended to it, then append a date to it.
               if(!post?.date) {
                  post.date = sub(new Date(), {minutes: min++}).toISOString();
               }
               // if a post doesn't have a reaction object appended to it, then append a reactions object to it.
               if(!post?.reactions){
                  post.reactions = {
                     thumbsUp: 0,
                     wow: 0,
                     heart: 0,
                     rocket: 0,
                     coffee: 0,
                  }
               }

               return post;
            })
            // we are using setAll so that the postsAdapter normalizes the data being set as 'initialState'
            return postsAdapter.setAll(initialState, loadedPosts)
         },
         // instead of using a single tag inside an array, we are defining furthur logic inside a function so that if the id
         // of any posts change, we invalidate the cache and re-fetch all posts.
         providesTags: (result, error, arg) => [
            {type: 'Post', id: "LIST"},
            ...result.ids.map((id) => ({ type: 'Post', id }))
         ]
      })
   })
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