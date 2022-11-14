import React from 'react'
// importing useSelector and useDispatch Hooks. useSelector is used to link up a reducer state with a cariable in this component. useDispatch is used to dispatch 
// actions from a store slice.
import { useSelector, useDispatch } from 'react-redux'
// importing actions from counterSlice
import { increment, decrement } from './counterSlice'

const Counter = () => {
   // instead of setting a count state, we are using useSelector to define a count state from the reducer/store. The 'counter' in state,counter.count comes from the
   // store where we are defining "counter: counterReducer".
   const count = useSelector((state) => state.counter.count)
   const dispatch = useDispatch() // importing the useDispatch so we can dispatch an action from a store slice
   return (
      <section>
         <p>{count}</p>
         <div>
            <button onClick={() => dispatch(increment())}> + </button>
            <button onClick={() => dispatch(decrement())}> - </button>
         </div>
      </section>
   )
}

export default Counter