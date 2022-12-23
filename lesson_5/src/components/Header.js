import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"
import { increaseCount, getCount } from "../features/posts/postsSlice";

const Header = () => {

   const dispatch = useDispatch()
   const count = useSelector(getCount)

   return(
      <header>
         <h1>Redux Blog</h1>
         <nav>
            <ul>
               <li><Link to="/">Home</Link></li>
               <li><Link to="post">Create Post</Link></li>
               <li><Link to="user">Authors/Users</Link></li>
            </ul>
            <button onClick={ () => dispatch(increaseCount()) }>{count}</button>
         </nav>
      </header>
   )
}

export default Header