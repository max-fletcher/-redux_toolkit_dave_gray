import { configureStore } from "@reduxjs/toolkit"
// importing counterReducer(a.k.a slice) from features/counter
// import postsReducer from '../features/posts/postsSlice'
import { apiSlice } from "../features/api/apiSlice" // Replacing postsReducer with apiSlice from where we will get the 
import usersReducer from '../features/users/usersSlice'


// the reducer object inside will contain all the reducers we will use
export const store = configureStore({
   reducer: {
      // posts: postsReducer,

      //using apiSlice for store. "apiSlice.reducerPath" comes from apiSlice.js so it is dynamic/computed. The "apiSlice.reducer" is the reducer
      // to use for this store
      [apiSlice.reducerPath]: apiSlice.reducer, 
      users: usersReducer,
   },
   // This middleware is required for use with RTK QUERY with an "apiSlice". It manages cache lifetimes and expiration info.
   middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware)
})