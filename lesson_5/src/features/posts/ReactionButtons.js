import { useDispatch } from "react-redux";
import { reactionAdded } from "./postsSlice";

const reactionEmoji = {
   thumbsUp: '👍',
   wow: '😮',
   heart: '❤️',
   rocket: '🚀',
   coffee: '☕'
}

const ReactionButtons = ({post}) => {
   const dispatch = useDispatch()

   // see thi: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
   // to figure out what is being done with the Object.entries. Map is being run on the array of keys and values from that Object.entries result.
   return( 
      Object.entries(reactionEmoji).map(([name, emoji]) => {
         return (
            <button 
               key={name} 
               type="button" 
               className="reactionButton"
               // Dispatch action that will increment an emoji count using the post's id and the reaction name(to identify it and increment the count)
               onClick={() => {
                  dispatch(reactionAdded({ postId: post.id, reaction: name }))
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