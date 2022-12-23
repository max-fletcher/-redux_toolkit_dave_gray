// A redux state objects is split into multiple state objects. Hence, a slice is a set of reducer logic, state and actions for each feature in the app.
// E.g a blog may have separate slices for posts, comments and likes/dislikes. We will handle each of the logic of each differently so each have 
// their own slices.
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const USERS_URL = 'https://jsonplaceholder.typicode.com/users'

const initialState = []

export const fetchUsers = createAsyncThunk('users/fetchUsers', async ()=> {
   try {
      const response = await axios.get(USERS_URL)
      return response.data
   } catch (error) {
      return error.message
   }
})

// contains reducer. 1st params in the name(used to call actions for this slice using the syntax state.?name?.action. In this case, an example is
// state.counter.increment. However, remember that we can choose to not call it in a component and instead export it from the slice itself with a
// designated name. See below), 2nd param is the initial state data(may be number, string, object etc but object is preferred),
// and 3rd param are the actions(see below for more info). Don't forget to export it(mandatory)
const usersSlice = createSlice({
   name: 'users',
   initialState,
   reducers: {
      // This is a replacement for the lines above. It is how you abstract the logic from inside a component into redux. The 'reducer' callback(where the state is 
      // persisted to store store) will run after 'prepare' callback(where the data is pre-processed before storing).
      
   },
   extraReducers(builder){
      builder.addCase(fetchUsers.fulfilled, (state, action) => {
         return action.payload
      })
   }
})

// we need to export BOTH the reducer AND the actions to use global store properly.

// exporting the actions for this slice(mandatory)
// export const { increment, decrement, reset, incrementByAmount } = counterSlice.actions

// This is to ascertain that 'users' inside 'state' will be exported. So if the structure of this slice ever changes, we need to change the export
// here and everywhere we use this, will grab the right data
export const selectAllUsers = (state) => state.users

export const selectUserById = (state, userId) => state.users.find((user) => user.id === userId)

// export const { postAdded } = postsSlice.actions

// exporting the reducer(mandatory)
export default usersSlice.reducer