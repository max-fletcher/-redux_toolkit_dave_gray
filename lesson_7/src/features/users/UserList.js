import { useSelector } from 'react-redux'
import { selectAllUsers } from './usersSlice'
import { Link } from 'react-router-dom'
// import { useGetUsersQuery } from "./usersSlice";

const UserList = () => {

   // const {
   //    isLoading,
   //    isSuccess,
   //    isError,
   //    error
   // } = useGetUsersQuery()

   const users = useSelector(selectAllUsers)

   const renderedUsers = users.map((user) => {
      return(
         <li key={user.id}>
            <Link to={`/user/${user.id}`}>{user.name}</Link>
         </li>
      )
   })

   return (
      <section>
         <h2>Users List</h2>
         {/* You can choose to use the map function here directly without using an intermediate variable */}
         <ul>{renderedUsers}</ul>
      </section>
   )
}

export default UserList