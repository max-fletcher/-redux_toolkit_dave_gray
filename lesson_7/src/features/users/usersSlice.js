// A redux state objects is split into multiple state objects. Hence, a slice is a set of reducer logic, state and actions for each feature in the app.
// E.g a blog may have separate slices for users, comments and likes/dislikes. We will handle each of the logic of each differently so each have 
// their own slices.
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ***IMPORTANT Importing createSelector so that we can return a memoized value for users and
// users. Also importing createEntityAdapter so that we can return normalized values in a way that is considered the usual conventon.
import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
// import { sub } from 'date-fns'

// Importing apiSlice that uses RTK QUERY. We will be defining and adding more logic to extend the endpoints for users RTK QUERY from here.
import { apiSlice } from "../api/apiSlice";

// An entity adapter stores data in a normalized state so it becomes easier to fetch using thunks or RTKQuery. (See Dave Gray Redux Toolkit - 2:35:19)
// we are using the "createEntityAdapter" hook to memoize users. We are also using a "sortComparer" function so we can sort the "users"
// before we store them in state(which was previously done in "userList")
const usersAdapter = createEntityAdapter({
   // By default, the adapter will use "id" but if there is no "id" field in the data being passed into the adapter, this needs to be defined
   // so the adapter knows what to use instaed. In this example, "userId" is used as "id".
   // selectId: (users) => user.userId,
   // sortComparer: (a,b) => b.date.localeCompare(a.date)
})

// REMOVED ALL USERS THUNKS TO IMPLEMENT EXTENDED RTK QUERIES INSTEAD



// contains reducer. 1st params in the name(used to call actions for this slice using the syntax state.?name?.action. In this case, an example is
// state.counter.increment. However, remember that we can choose to not call it in a component and instead export it from the slice itself with a
// designated name. See below), 2nd param is the initial state data(may be number, string, object etc but object is preferred),
// and 3rd param are the actions(see below for more info). Don't forget to export it(mandatory)
// const usersSlice = createSlice({
//    name: 'users',
//    initialState,
//    reducers: {
//       // This is a replacement for the lines above. It is how you abstract the logic from inside a component into redux. The 'reducer' callback(where the state is 
//       // persisted to store store) will run after 'prepare' callback(where the data is pre-processed before storing).
      
//    },
//    extraReducers(builder){
//       builder.addCase(fetchUsers.fulfilled, (state, action) => {
//          return action.payload
//       })
//    }
// })




// Binding the "usersAdapter" "getInitialState" function to a variable called "initialState". We don't need to define an array of
// objects(in this case "users: []") for storing the default array/data structure. It is automatically defined. We are not defining
// 'status', 'error' and 'count' for this instance since some/all of it will be defined by RTK QUERY.
const initialState = usersAdapter.getInitialState()

// REPLACING USERSSLICE SO WE CAN USE EXTENDED RTK QUERY INSTEAD
// importing apiSlice from 'features/api/apiSlice' and then injecting endpoints to it from here instead of defining it there.
export const extendedApiSlice = apiSlice.injectEndpoints({
   endpoints: (builder) => ({
      getUsers: builder.query({ // Get all users
         // hit the '/users' endpoint provided by json-server
         query: () => '/users',
         // transform the data before storing/cacheing it. We are looping over the data and adding a date to every one of them. But we
         // we are incrementing that time by 1 min as we loop. We are also appending reactions to every user as well.
         transformResponse: (responseData) => {
            // console.log(responseData);
            // let min = 1
            // users is a new array of users that we are getting as we loop over the response data. We are adding 'time' and
            // 'reactions' as stated above.
            // const users = responseData.map((user) => {
            //    // if a user doesn't have date appended to it, then append a date to it.
            //    if(!user?.date) {
            //       user.date = sub(new Date(), {minutes: min++}).toISOString();
            //    }
            //    // if a user doesn't have a reaction object appended to it, then append a reactions object to it.
            //    if(!user?.reactions){
            //       user.reactions = {
            //          thumbsUp: 0,
            //          wow: 0,
            //          heart: 0,
            //          rocket: 0,
            //          coffee: 0,
            //       }
            //    }

            //    return user;
            // })
            // we are using setAll so that the postsAdapter normalizes the data being set as 'initialState'
            return usersAdapter.setAll(initialState, responseData)
         },
         // instead of using a single tag inside an array, we are defining furthur logic inside a function so that if the id
         // of any users change, we invalidate the cache and re-fetch users.

         // READ THIS FOR A BROADER UNDERSTANDING https://redux-toolkit.js.org/rtk-query/usage/automated-refetching#invalidating-cache-data
         // in other words, the below blocks of code will generate an array of objects that look like this:
         // [{type: 'User', id: 'List'}, {type: 'User', id: 1}, {type: 'User', id: 2}, {type: 'User', id: 3}..]
         // the significance is that now, you have more granular control of what elements, or if all elements will be invalidated in cache
         // based on what the "invalidatesTags" property passes from each endpoint, which is better from a UX/UI perspective since it will
         // only re-render the components whose data is being updated without re-rendering the components whose data is not being re-fetched.
         providesTags: (result, error, arg) => [
            {type: 'User', id: "LIST"},
            ...result.ids.map((id) => ({ type: 'User', id }))
         ]
      }),
      // getUserById: builder.query({ // Get all posts by a specific author
      //    // hit the '/posts/' endpoint with a query-string provided by json-server
      //    query: id => `/users/?userId=${id}`,
      //    // transform the data before storing/cacheing it. We are looping over the data and adding a date to every one of them. But we
      //    // we are incrementing that time by 1 min as we loop. We are also appending reactions to every post as well.
      //    transformResponse: (responseData) => {
      //       // // let min = 1
      //       // // loadedPosts is a new array of posts that we are getting as we loop over the response data. We are adding 'time' and
      //       // // 'reactions' as stated above.
      //       // const loadedUsers = responseData.map((user) => {
      //       //    // if a post doesn't have date appended to it, then append a date to it.
      //       //    // if(!post?.date) {
      //       //    //    post.date = sub(new Date(), {minutes: min++}).toISOString();
      //       //    // }
      //       //    // // if a post doesn't have a reaction object appended to it, then append a reactions object to it.
      //       //    // if(!post?.reactions){
      //       //    //    post.reactions = {
      //       //    //       thumbsUp: 0,
      //       //    //       wow: 0,
      //       //    //       heart: 0,
      //       //    //       rocket: 0,
      //       //    //       coffee: 0,
      //       //    //    }
      //       //    // }

      //       //    return user;
      //       // })
      //       // we are using setAll so that the postsAdapter normalizes the data being set as 'initialState'
      //       return usersAdapter.setAll(initialState, responseData)
      //    },
      //    providesTags: (result, error, arg) => { // selectively invalidating cache
      //       console.log(result);
      //       return [
      //          ...result.ids.map((id) => ({ type: 'User', id }))
      //       ]
      //    }
      // }),
      // addNewPost: builder.mutation({ // Add new post
      //    // hit the '/posts' endpoint with method = POST and a body that contains data
      //    query: initialPost => ({
      //       url: '/posts',
      //       method: 'POST',
      //       body: {
      //          ...initialPost,
      //          userId: Number(initialPost.userId),
      //          date: new Date().toISOString(),
      //          reactions: {
      //             thumbsUp: 0,
      //             wow: 0,
      //             heart: 0,
      //             rocket: 0,
      //             coffee: 0,
      //          }
      //       }
      //    }),
      //    invalidatesTags: [
      //       { type: "Post", id: "LIST" }
      //    ]
      // }),
      // updatePost: builder.mutation({ // Add new post
      //    // hit the '/posts/id' endpoint with method = PUT and a body that contains data
      //    query: initialPost => ({
      //       url: `/posts/${initialPost.id}`,
      //       method: 'PUT',
      //       body: {
      //          ...initialPost,
      //          date: new Date().toISOString(),
      //       }
      //    }),
      //    invalidatesTags: (result, error, arg) => [ // arg contains the original post and hence, arg.id is the post id
      //       { type: 'Post', id: arg.id }
      //    ]
      // }),
      // deletePost: builder.mutation({ // Add new post
      //    // hit the '/posts/id' endpoint with method = DELETE and a body that contains the id of the post
      //    query: ({ id }) => ({ // using destructuring to get the post id only and not the entire post object
      //       url: `/posts/${id}`,
      //       method: 'DELETE',
      //       body: { id }
      //    }),
      //    invalidatesTags: (result, error, arg) => [ // arg contains the original post and hence, arg.id is the post id
      //       { type: 'Post', id: arg.id }
      //    ]
      // }),
      // addReaction: builder.mutation({ // Add reaction
      //    // hit the '/posts/postId' endpoint with method = PATCH and a body that contains the new reactions
      //    // We will be using optimistic update on "reactions" by using the "onQueryStarted" handler.s
      //    // We will be incrementing a reaction and pass the reactions object containing all reactions into this query here so it can be used to update the reactions
      //    // in the adapter/normalized state.
      //    query: ({ postId, reactions }) => ({ // using destructuring to get the postId and reactions and not the entire post object
      //       url: `/posts/${postId}`,
      //       method: 'PATCH',
      //       // In a real application, we'd probably need to base this on user ID somehow so that a user can't do the same reaction more than once
      //       body: { reactions }
      //    }),
      //    // Passing 2 arguments, both of them are objects that contain stuff. 1st param object contains the data that we will update. 
      //    // 2nd param object contains dispatch, which is an object that can be used to dispatch a query inside the "extendedApiSlice.util". "queryFulfilled" is a promise that
      //    // will be used in the try catch block to gracefully handle failures.
      //    async onQueryStarted({ postId, reactions }, { dispatch, queryFulfilled }){ // onQueryStarted handler
      //       // dispatching/executing some code from inside this handler to do optimistic update
      //       // 'updateQueryData' requires the endpoint name and cache key arguments, so it knows which piece of cache state to update
      //       const patchResult = dispatch(
      //          // 'extendedApiSlice.util.updateQueryData' takes 3 arguments. 1st is the endpoint to hit/run, 2nd is the cacke-key argument(which we don't need here)
      //          // which is used to update cached dataset and the 3rd contains a draft of our data that is modified(hence the name 'draft').
      //          // See this: https://redux-toolkit.js.org/rtk-query/usage/manual-cache-updates#recipes and this: https://redux-toolkit.js.org/rtk-query/api/created-api/api-slice-utils#updatequerydata
      //          extendedApiSlice.util.updateQueryData('getPosts', undefined, draft => {
      //             // The 'draft' is Immer-wrapped and can be "mutated" like in createSlice
      //             const post = draft.entities[postId] // temporarily storing the data that is being modified in a var called 'post'
      //             if(post){ post.reactions = reactions } // if the draft/post/data exists, then update its reactions(LHS) with the reactions we passed in(RHS) as argument
      //          })
      //       )
      //       try{
      //          await queryFulfilled
      //       }
      //       catch{
      //          patchResult.undo()
      //       }
      //    },
      // }),
   })
})

// EXPORTING ENDPOINTS THAT WE WILL USE IN THE COMPONENTS
export const {
   // The convention is that the name must match the camel-case names for the queries defined inside the endpoint object. It should
   // start with "use" and end with "Query" with the pascal-cased query name sandwiched between them. So if we define an endpoint
   // called "getPizzas", the export here should be called "useGetPizzasQuery".
   // **IMPORTANT: NOTE THAT QUERY AND MUTATION ARE DIFFERENT. QUERY ONLY FETCHES DATA AND MUTATON ALTERS THE DATA
   // useGetUserByIdQuery,
   useGetUsersQuery,
} = extendedApiSlice


// NEW SELECTORS THAT UTILIZES THE extendedApiSlice
// returns the query result object(without fetching data)
export const selectUsersResult = extendedApiSlice.endpoints.getUsers.select() // accessing select() via ".endpoints" in "extendedApiSlice"
// (since it is an object), then "getUsers"(which is a method) and finally, the "select()" method which is providing us a result object(which
// contains not just the data, but the "isLoading", "isSuccess", "isError" & "error" as well)

// create memoized selectors. In the above block, we are getting the entire result(i.e the nomalized state objects with ids & entities along
// with the "isLoading", "isSuccess", "isError" & "error") so we are just passing the "data" part of that object.
const selectUsersData = createSelector(
   selectUsersResult,
   usersResult => usersResult.data // nomalized state objects with ids & entities
)

// THESE ARE SELECTORS AS WELL
// using "selectUsersData" to create selectors using "getSelectors()" function.
// commented out "export const selectAllUsers..." and "export const selectUserById..." so that we can use "getSelectors" hook provided by 
// the "createEntityAdapter" hook. It provides some selectors out of the box that can be aliased by using destructuring.
export const {
   selectAll: selectAllUsers, // alias for "selectAll" is "selectAllUsers"
   // selectById: selectUserById, // alias for "selectById" is "selectPostById"
   // selectIds: selectPostIds, // alias for "selectIds" is "selectPostIds"
   // We do have to pass a selector that returns the posts slice of the state
} = usersAdapter.getSelectors((state) => selectUsersData(state) ?? initialState) // using null coalescing so if selectPostsData(state) is
// empty, will return the "initialState"


// REMOVED/COMMENTED OUT ALL SELECTORS BELOW IN ORDER TO USE RTQ QUERY. ANY ADDITIONAL SELECTORS ARE DEFINED ABOVE. 
// we need to export BOTH the reducer AND the actions to use global store properly.

// exporting the actions for this slice(mandatory)
// export const { increment, decrement, reset, incrementByAmount } = counterSlice.actions

// This is to ascertain that 'users' inside 'state' will be exported. So if the structure of this slice ever changes, we need to change the export
// here and everywhere we use this, will grab the right data
// export const selectAllUsers = (state) => state.users
// export const selectUserById = (state, userId) => state.users.find((user) => user.id === userId)

// export const { postAdded } = postsSlice.actions

// exporting the reducer(mandatory)
// export default usersSlice.reducer
// //END REMOVED/COMMENTED OUT ALL SELECTORS BELOW IN ORDER TO USE RTQ QUERY. ANY ADDITIONAL SELECTORS ARE DEFINED ABOVE.