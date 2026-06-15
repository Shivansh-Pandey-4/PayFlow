import { createBrowserRouter, Outlet } from "react-router-dom"
import Footer from "./components/Footer"
import Header from "./components/Header"
import Body from "./pages/Body"
import Transfer from "./pages/Transfer"
import Signin from "./pages/Signin"
import Signup from "./pages/Signup"

function App() {

  return (
    <div className="min-h-screen bg-zinc-400">
      <div className="flex flex-col max-w-4xl mx-auto border-x border-zinc-300 bg-white min-h-screen">

        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />

      </div>
    </div>
  )
}


const appConfig = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Body />
      },
      {
        path: "/transfer/:id",
        element: <Transfer />
      },
      {
        path: "/signup",
        element: <Signup />
      },
      {
        path: "/signin",
        element: <Signin />
      }
    ]
  }
])

export default appConfig;