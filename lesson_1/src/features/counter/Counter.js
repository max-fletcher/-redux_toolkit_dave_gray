import React from 'react'
import { useState } from 'react'
// importing useSelector and useDispatch Hooks. useSelector is used to link up a reducer state with a variable in this component. useDispatch is used to dispatch 
// actions from a store slice.
import { useSelector, useDispatch } from 'react-redux'
// importing actions from counterSlice
import { increment, decrement, reset, incrementByAmount } from './counterSlice'

const Counter = () => {
   const [incrementAmount, setIncrementAmount] = useState(0)
   const addValue = Number(incrementAmount) || 0 // if incrementAmount is not a number, we will set addValue to 0, else, addValue will be equal to incrementAmount

   const resetAll  = () => {
      setIncrementAmount(0); // resetting value of incrementAmount to 0
      dispatch(reset())  // using the 'reset' function from 'counter' to set value to 0
   }

   // instead of setting a count state, we are using useSelector to define a count state from the reducer/store. The 'counter' in state,counter.count comes from 
   // 'name' property in the counterSlice of counterSlice.js(will always grab the name defined inside the slice).
   const count = useSelector((state) => state.counter.count)
   const dispatch = useDispatch() // importing and storing dispatch hook in a varaible so we can use it to fire actions that are defined in the slices
   return (
      <section>
         <p>{count}</p>
         <div>
            <button onClick={() => dispatch(increment())}> + </button>
            <button onClick={() => dispatch(decrement())}> - </button>
         </div>

         <input type="text" value={incrementAmount} onChange={(e) => setIncrementAmount(e.target.value)} />

         <div>
            <button onClick={() => dispatch(incrementByAmount(addValue))}> Add Amount </button>
            <button onClick={() => resetAll()}> Reset </button>
         </div>
      </section>
   )
}

export default Counter