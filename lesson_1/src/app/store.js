import { configureStore } from "@reduxjs/toolkit"
// importing counterReducer(a.k.a slice) from features/counter
import counterReducer from '../features/counter/counterSlice'

// the reducer object inside will contain all the reducers we will use. We will wrap the <App /> component with this store
// so our App can access these store reducers from all places. Else, it will not work.

// the reducer object inside will contain all the reducers we will use
export const store = configureStore({
   reducer: {
      counter: counterReducer,
   }
})