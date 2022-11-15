// A redux state objects is split into multiple state objects. Hence, a slice is a set of reducer logic, state and actions for each feature in the app.
// E.g a blog may have separate slices for posts, comments and likes/dislikes. We will handle each of the logic of each differently so each have 
// their own slices.

import { createSlice } from "@reduxjs/toolkit"

// set initial values
const initialState = {
   count: 0
}

// contains reducer. 1st params in the name(used to call actions for this slice using the syntax state.?name?.action. In this case, an example is
// state.counter.increment. However, remember that we can choose to not call it in a component and instead export it from the slice itself with a
// designated name. See lesson_2 for an example), 2nd param is the initial state data(may be number, string, object etc but object is preferred),
// and 3rd param are the actions(see below for more info). Don't forget to export it(mandatory)
export const counterSlice = createSlice({
   name: 'counter',
   initialState,
   // all reducer actions set as comma separated objects
   reducers:{
      increment: (state)=>{
         state.count += 1
      },
      decrement: (state)=>{
         state.count -= 1
      },
      reset: (state)=>{
         state.count = 0
      },
      incrementByAmount: (state, action)=>{
         state.count += action.payload
      }
   }
})

// we need to export BOTH the reducer AND the actions to use global store properly.

// exporting the actions for this slice(mandatory)
export const { increment, decrement, reset, incrementByAmount } = counterSlice.actions
// exporting the reducer(mandatory)
export default counterSlice.reducer