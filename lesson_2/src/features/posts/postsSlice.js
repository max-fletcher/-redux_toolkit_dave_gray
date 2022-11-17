// A redux state objects is split into multiple state objects. Hence, a slice is a set of reducer logic, state and actions for each feature in the app.
// E.g a blog may have separate slices for posts, comments and likes/dislikes. We will handle each of the logic of each differently so each have 
// their own slices.
import { createSlice, nanoid } from "@reduxjs/toolkit";
import { sub } from 'date-fns'

// set initial values
const initialState = [
   {
      id: '1',
      title: 'Learning Redux Toolkit',
      content: 'Heard good things',
      date: sub(new Date(), {minutes: 10}).toISOString(),
      reactions: {
         thumbsUp : 0,
         wow : 0,
         heart : 0,
         rocket : 0,
         coffee : 0
      }
   },
   {
      id: '2',
      title: 'Slices...',
      content: "I love pizzas",
      date: sub(new Date(), {minutes: 20}).toISOString(),
      reactions: {
         thumbsUp : 0,
         wow : 0,
         heart : 0,
         rocket : 0,
         coffee : 0
      }
   },
]

// contains reducer. 1st params in the name(used to call actions for this slice using the syntax state.?name?.action. In this case, an example is
// state.counter.increment. However, remember that we can choose to not call it in a component and instead export it from the slice itself with a
// designated name. See below), 2nd param is the initial state data(may be number, string, object etc but object is preferred),
// and 3rd param are the actions(see below for more info). Don't forget to export it(mandatory)
const postsSlice = createSlice({
   name: 'posts',
   initialState,
   reducers: {
      // postAdded(state, action){
      //    state.push(action.payload)
      // }
      // This is a replacement for the 3 lines above. It is how you abstract the logic from inside a component into redux. The 'reducer' callback(where the state is 
      // persisted to store store) will run after 'prepare' callback(where the data is pre-processed before storing).
      postAdded: {
         reducer(state, action){
            state.push(action.payload)
         },
         prepare(title, content, userId){
            return{
               payload: {
                  id: nanoid(),
                  userId,
                  title,
                  content,
                  date: new Date().toISOString(),
                  reactions: {
                     thumbsUp : 0,
                     wow : 0,
                     heart : 0,
                     rocket : 0,
                     coffee : 0
                  }
               }
            }
         }
      },

      // reactionAdded(state, action) {
      //    const { postId, reaction } = action.payload
      //    const existingPost = state.find((post) => post.id === postId)
      //    if(existingPost){
      //       existingPost.reactions[reaction]++
      //    }
      // }

      // A reducer action can also be declared using the syntax above. Though its prefereable to stick to the convention below.
      reactionAdded: {
         reducer(state, action){
            const { postId, reaction } = action.payload
            const existingPost = state.find((post) => post.id === postId)
            if(existingPost){
               existingPost.reactions[reaction]++
            }
         }
      }

   }
})

// we need to export BOTH the reducer AND the actions to use global store properly.

// exporting the actions for this slice(mandatory)
// export const { increment, decrement, reset, incrementByAmount } = counterSlice.actions

// This is to ascertain that 'posts' inside 'state' will be exported. So if the structure of this slice ever changes, we need to change the export
// here and everywhere we use this, will grab the right data
export const selectAllPosts = (state) => state.posts

export const { postAdded, reactionAdded } = postsSlice.actions

// exporting the reducer(mandatory)
export default postsSlice.reducer