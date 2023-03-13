// import { useDispatch } from "react-redux"; // REMOVED FOR RTK QUERY
import { reactionAdded } from "./postsSlice";
import { useAddNewPostMutation } from "./postsSlice";

const reactionEmoji = {
   thumbsUp: '👍',
   wow: '😮',
   heart: '❤️',
   rocket: '🚀',
   coffee: '☕'
}

const ReactionButtons = ({post}) => {
   // const dispatch = useDispatch() // REMOVED FOR RTK QUERY

   const [addReaction] =  useAddNewPostMutation()

   // see thi: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
   // to figure out what is being done with the Object.entries. Map is being run on the array of keys and values from that Object.entries result.
   return(
      Object.entries(reactionEmoji).map(([name, emoji]) => {
         return (
            <button
               key={name}
               type="button"
               className="reactionButton"
               // REMOVED FOR RTK QUERY
               // Dispatch action that will increment an emoji count using the post's id and the reaction name(to identify it and increment the count)
               // onClick={() => {
               //    dispatch(reactionAdded({ postId: post.id, reaction: name }))
               // }}

               onClick={() => {
                  const newValue = post.reactions[name] + 1 // incrementing the value of a reaction because post.reactions[name] will give us a specific reaction's count
                  addReaction({ postId: post.id, reactions: { ...post.reactions, [name]: newValue } }) // setting new value(if onClick is pressed) for this reaction using destructuring
               }}
            >
               {/* Will output something like 'emoji-icon count' */}
               {emoji} {post.reactions[name]}
            </button>
         )
      })
   )
}

export default ReactionButtons