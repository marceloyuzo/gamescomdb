import { createBrowserRouter } from "react-router-dom"
import { Layout } from "./components/Layout"
import { Landing } from "./pages/landing"
import { Login } from "./pages/login"
import { Register } from "./pages/register"
import { Profile } from "./pages/profile"

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Landing />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/profile",
        element: <Profile />
      }
    ]
  }
])

export { router }