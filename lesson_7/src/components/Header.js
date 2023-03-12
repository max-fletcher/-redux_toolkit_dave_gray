import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux" // FOR TESTING MEMOIZATION
// import { increaseCount, getCount } from "../features/posts/postsSlice"; // FOR TESTING MEMOIZATION


const Header = () => {

   // const dispatch = useDispatch() // FOR TESTING MEMOIZATION
   // const count = useSelector(getCount) // FOR TESTING MEMOIZATION

   return(
      <header>
         <h1>Redux Blog</h1>
         <nav>
            <ul>
               <li><Link to="/">Home</Link></li>
               <li><Link to="post">Create Post</Link></li>
               <li><Link to="user">Authors/Users</Link></li>
            </ul>
            {/* FOR TESTING MEMOIZATION */}
            {/* <button onClick={ () => dispatch(increaseCount()) }>{count}</button> */}
         </nav>
      </header>
   )
}

export default Header