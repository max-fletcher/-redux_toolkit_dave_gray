import { Outlet } from "react-router-dom";
import Header from "./Header"

// Main template for out app
const Layout = () => {
   return(
      <>
         {/* Navbar for the entire app */}
         <Header />
         <main className="App">
            <Outlet />
         </main>
      </>
   )
}

export default Layout