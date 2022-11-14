// A redux state objects is split into multiple state objects. Hence, a slice is a set of reducer logic, state and actions for each feature in the app.
// E.g a blog may have separate slices for posts, comments and likes/dislikes. We will handle each of the logic of each differently so each have 
// their own slices.
import { createSlice } from "@reduxjs/toolkit";

// set initial values
const initialState = [
   {id: '1', title: 'Learning Redux Toolkit', content: 'Heard good things'},
   {id: '2', title: 'Slices...', content: "I love pizzas"},
]

// contains reducer. 1st params in the name, 2nd param is the initial state data(may be number, string, object etc but object is preferred),
// and 3rd param are the actions(see below for more info). Don't forget to export it(mandatory)
const postsSlice = createSlice({
   name: 'posts',
   initialState,
   reducers: {

   }
})

// we need to export BOTH the reducer AND the actions to use global store properly.

// exporting the actions for this slice(mandatory)
// export const { increment, decrement, reset, incrementByAmount } = counterSlice.actions

// This is to ascertain that 'posts' inside 'state' will be exported. So if the structure of this slice ever changes, we need to change the export
// here and everywhere we use this, will grab the right data
export const selectAllPosts = (state) => state.posts

// exporting the reducer(mandatory)
export default postsSlice.reducer