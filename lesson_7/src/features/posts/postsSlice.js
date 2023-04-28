// ***IMPORTANT Importing createSelector so that we can return a memoized value for users and
// posts. Also importing createEntityAdapter so that we can return normalized values in a way that is considered the usual convention.
import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from 'date-fns'

// Importing apiSlice that uses RTK QUERY. We will be defining and adding more logic to extend the endpoints for posts RTK QUERY from here.
import { apiSlice } from "../api/apiSlice";

// An entity adapter stores data in a normalized state so it becomes easier to fetch using thunks or RTKQuery. (See Dave Gray Redux Toolkit - 2:35:19)
// we are using the "createEntityAdapter" hook to memoize posts. We are also using a "sortComparer" function so we can sort the "posts"
// before we store them in state(which was previously done in "PostList")
const postsAdapter = createEntityAdapter({
   // By default, the adapter will use "id" but if there is no "id" field in the data being passed into the adapter, this needs to be defined
   // so the adapter knows what to use instaed. In this example, "postId" is used as "id".
   // selectId: (post) => post.postId,
   sortComparer: (a,b) => b.date.localeCompare(a.date)
})

// REMOVED ALL POSTS THUNKS TO IMPLEMENT EXTENDED RTK QUERIES INSTEAD

// Binding the "postsAdapter" "getInitialState" function to a variable called "initialState". We don't need to define an array of
// objects(in this case "posts: []") for storing the default array/data structure. It is automatically defined. We are not defining
// 'status', 'error' and 'count' for this instance since some/all of it will be defined by RTK QUERY.
const initialState = postsAdapter.getInitialState()

// REPLACING POSTSSLICE SO WE CAN USE EXTENDED RTK QUERY INSTEAD
// importing apiSlice from 'features/api/apiSlice' and then injecting endpoints to it from here instead of defining it there.
export const extendedApiSlice = apiSlice.injectEndpoints({
   endpoints: (builder) => ({
      getPosts: builder.query({ // Get all posts
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
         // of any posts change, we invalidate the cache and re-fetch posts.

         // READ THIS FOR A BROADER UNDERSTANDING https://redux-toolkit.js.org/rtk-query/usage/automated-refetching#invalidating-cache-data
         // in other words, the below blocks of code will generate an array of objects that look like this:
         // [{type: 'Post', id: 'List'}, {type: 'Post', id: 1}, {type: 'Post', id: 2}, {type: 'Post', id: 3}..]
         // the significance is that now, you have more granular control of what elements, or if all elements will be invalidated in cache
         // based on what the "invalidatesTags" property passes from each endpoint, which is better from a UX/UI perspective since it will
         // only re-render the components whose data is being updated without re-rendering the components whose data is not being re-fetched.
         providesTags: (result, error, arg) => [
            {type: 'Post', id: "LIST"},
            ...result.ids.map((id) => ({ type: 'Post', id }))
         ]
      }),
      getPostsByUserId: builder.query({ // Get all posts by a specific author
         // hit the '/posts/' endpoint with a query-string provided by json-server
         query: id => `/posts/?userId=${id}`,
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
         providesTags: (result, error, arg) => { // selectively invalidating cache
            console.log(result);
            return [
               ...result.ids.map((id) => ({ type: 'Post', id }))
            ]
         }
      }),
      addNewPost: builder.mutation({ // Add new post
         // hit the '/posts' endpoint with method = POST and a body that contains data
         query: initialPost => ({
            url: '/posts',
            method: 'POST',
            body: {
               ...initialPost,
               userId: Number(initialPost.userId),
               date: new Date().toISOString(),
               reactions: {
                  thumbsUp: 0,
                  wow: 0,
                  heart: 0,
                  rocket: 0,
                  coffee: 0,
               }
            }
         }),
         invalidatesTags: [
            { type: "Post", id: "LIST" }
         ]
      }),
      updatePost: builder.mutation({ // Add new post
         // hit the '/posts/id' endpoint with method = PUT and a body that contains data
         query: initialPost => ({
            url: `/posts/${initialPost.id}`,
            method: 'PUT',
            body: {
               ...initialPost,
               date: new Date().toISOString(),
            }
         }),
         invalidatesTags: (result, error, arg) => [ // arg contains the original post and hence, arg.id is the post id
            { type: 'Post', id: arg.id }
         ]
      }),
      deletePost: builder.mutation({ // Add new post
         // hit the '/posts/id' endpoint with method = DELETE and a body that contains the id of the post
         query: ({ id }) => ({ // using destructuring to get the post id only and not the entire post object
            url: `/posts/${id}`,
            method: 'DELETE',
            body: { id }
         }),
         invalidatesTags: (result, error, arg) => [ // arg contains the original post and hence, arg.id is the post id
            { type: 'Post', id: arg.id }
         ]
      }),
      addReaction: builder.mutation({ // Add reaction
         // hit the '/posts/postId' endpoint with method = PATCH and a body that contains the new reactions
         // We will be using optimistic update on "reactions" by using the "onQueryStarted" handler.s
         // We will be incrementing a reaction and pass the reactions object containing all reactions into this query here so it can be used to update the reactions
         // in the adapter/normalized state.
         query: ({ postId, reactions }) => ({ // using destructuring to get the postId and reactions and not the entire post object
            url: `/posts/${postId}`,
            method: 'PATCH',
            // In a real application, we'd probably need to base this on user ID somehow so that a user can't do the same reaction more than once
            body: { reactions }
         }),
         // Passing 2 arguments, both of them are objects that contain stuff. 1st param object contains the data that we will update. 
         // 2nd param object contains dispatch, which is an object that can be used to dispatch a query inside the "extendedApiSlice.util". "queryFulfilled" is a promise that
         // will be used in the try catch block to gracefully handle failures.
         async onQueryStarted({ postId, reactions }, { dispatch, queryFulfilled }){ // onQueryStarted handler
            // dispatching/executing some code from inside this handler to do optimistic update
            // 'updateQueryData' requires the endpoint name and cache key arguments, so it knows which piece of cache state to update
            const patchResult = dispatch(
               // 'extendedApiSlice.util.updateQueryData' takes 3 arguments. 1st is the endpoint to hit/run, 2nd is the cacke-key argument(which we don't need here)
               // which is used to update cached dataset and the 3rd contains a draft of our data that is modified(hence the name 'draft').
               // See this: https://redux-toolkit.js.org/rtk-query/usage/manual-cache-updates#recipes and this: https://redux-toolkit.js.org/rtk-query/api/created-api/api-slice-utils#updatequerydata
               extendedApiSlice.util.updateQueryData('getPosts', undefined, draft => {
                  // The 'draft' is Immer-wrapped and can be "mutated" like in createSlice
                  const post = draft.entities[postId] // temporarily storing the data that is being modified in a var called 'post'
                  if(post){ post.reactions = reactions } // if the draft/post/data exists, then update its reactions(LHS) with the reactions we passed in(RHS) as argument
               })
            )
            try{
               await queryFulfilled
            }
            catch{
               patchResult.undo()
            }
         },
      }),
   })
})

// EXPORTING ENDPOINTS THAT WE WILL USE IN THE COMPONENTS
export const {
   // The convention is that the name must match the camel-case names for the queries defined inside the endpoint object. It should
   // start with "use" and end with "Query" with the pascal-cased query name sandwiched between them. So if we define an endpoint
   // called "getPizzas", the export here should be called "useGetPizzasQuery".
   // **IMPORTANT: NOTE THAT QUERY AND MUTATION ARE DIFFERENT. QUERY ONLY FETCHES DATA AND MUTATON ALTERS THE DATA
   useGetPostsQuery,
   useGetPostsByUserIdQuery,
   useAddNewPostMutation,
   useUpdatePostMutation,
   useDeletePostMutation,
   useAddReactionMutation
} = extendedApiSlice



// REMOVED/COMMENTED OUT ALL SELECTORS BELOW IN ORDER TO USE RTQ QUERY. ANY ADDITIONAL SELECTORS ARE DEFINED ABOVE. 
// exporting the actions for this slice(mandatory)
// export const { increment, decrement, reset, incrementByAmount } = counterSlice.actions

// This is to ascertain that 'posts' inside 'state' will be exported. So if the structure of this slice ever changes, we just need to change
// the export here and everywhere we use this, will grab the right data
// export const selectAllPosts = (state) => state.posts.posts
// export const getPostsStatus = (state) => state.posts.status
// export const getPostsError = (state) => state.posts.error
// export const getCount = (state) => state.posts.count
// END REMOVED/COMMENTED OUT ALL SELECTORS BELOW IN ORDER TO USE RTQ QUERY. ANY ADDITIONAL SELECTORS ARE DEFINED ABOVE. 



// NEW SELECTORS THAT UTILIZES THE extendedApiSlice
// returns the query result object(without fetching data)
export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select() // accessing select() via ".endpoints" in "extendedApiSlice"
// (since it is an object), then "getPosts"(which is a method) and finally, the "select()" method which is providing us a result object(which
// contains not just the data, but the "isLoading", "isSuccess", "isError" & "error" as well)

// create memoized selectors. In the above block, we are getting the entire result(i.e the nomalized state objects with ids & entities along
// with the "isLoading", "isSuccess", "isError" & "error") so we are just passing the "data" part of that object.
const selectPostsData = createSelector(
   selectPostsResult,
   postsResult => postsResult.data // nomalized state objects with ids & entities
)

// THESE ARE SELECTORS AS WELL
// using "selectPostsData" to create selectors using "getSelectors()" function.
// commented out "export const selectAllPosts..." and "export const selectPostById..." so that we can use "getSelectors" hook provided by 
// the "createEntityAdapter" hook. It provides some selectors out of the box that can be aliased by using destructuring.
export const {
   selectAll: selectAllPosts, // alias for "selectAll" is "selectAllPosts"
   selectById: selectPostById, // alias for "selectById" is "selectPostById"
   selectIds: selectPostIds, // alias for "selectIds" is "selectPostIds"
   // We do have to pass a selector that returns the posts slice of the state
} = postsAdapter.getSelectors((state) => selectPostsData(state) ?? initialState) // using null coalescing so if selectPostsData(state) is
// empty, will return the "initialState"



// //REMOVED/COMMENTED OUT ALL SELECTORS BELOW IN ORDER TO USE RTQ QUERY. ANY ADDITIONAL SELECTORS ARE DEFINED ABOVE.

// // find and return a single post
// // export const selectPostById = (state, postId) =>
// //    state.posts.posts.find(post => post.id === postId) // returns post that has same postId

// // selectPostById doesn't memoize the value returned so anything that causes rerender will cause that function to run again. This function
// // (selectPostByUser) will not do that as it returns memoized values only. The counter component we put inside the header can be used to
// // demonstrate that. If we click on it and change the counter, by using react devtools "components" panel, it can be seen that the outlet and
// // other components below it(e.g PostList & UserPage) re-renders, even though it shouldn't since neither "posts" nor "user" changed.

// // A createSelector is basically a way to memoize redux states. It will accept one or more input functions as 1st param that contains an array of 
// // functions that are dependencies (i.e the values that are returned from these functions are the dependencies) and they provide the input 
// // parameters for the 2nd param, which is the called the output function. Hence, the array of dependencies must coincide with the 2nd Param's function params
// // (2 for 2 in this case). So, "selectAllPosts" will provide the dependency for "posts" and "userId" will provide the dependency for "userId".
// // Only if one of these 2 dependencies change, will the "selectPostsByUser" be triggered again(which prevents unnecessary re-renders).

// // If we chose to, we could've replaced "selectAllPosts" with "(state) => state.posts.posts", which means the same(i.e if posts
// // inside posts state changes, then "selectPostsByUser" will re-run). Using "selectAllPosts" is just a shortcut since it equals to
// // "(state) => state.posts.posts".
// export const selectPostsByUser = createSelector( // Returns a memoized lost of posts by a single user, unlike "selectPostById". 
//    [selectAllPosts, (state, userId) => userId],
//    (posts, userId) => posts.filter((post) => post.userId === userId)
// )

// // we removed the "postAdded" since it was replaced with "fetchPosts". We added  "increaseCount" instead that will increment count.
// export const { increaseCount, reactionAdded } = postsSlice.actions

// // exporting the reducer(mandatory)
// export default postsSlice.reducer
// //END REMOVED/COMMENTED OUT ALL SELECTORS BELOW IN ORDER TO USE RTQ QUERY. ANY ADDITIONAL SELECTORS ARE DEFINED ABOVE.