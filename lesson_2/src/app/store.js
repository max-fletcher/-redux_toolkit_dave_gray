import { configureStore } from "@reduxjs/toolkit"
// importing counterReducer(a.k.a slice) from features/counter
import postsReducer from '../features/posts/postsSlice'


// the reducer object inside will contain all the reducers we will use
export const store = configureStore({
   reducer: {
      posts: postsReducer
   }
})