import { createBrowserRouter } from "react-router-dom"
import { Layout } from "./components/Layout"
import { Landing } from "./pages/landing"
import { Login } from "./pages/login"
import { Register } from "./pages/register"
import { CompleteRegister } from "./pages/register/register_p2"
import { Profile } from "./pages/profile"
import { ListGames } from "./pages/list/games"
import { Reviews } from "./pages/list/reviews"
import { NewReview } from "./pages/list/reviews/new"

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
        path: "/register/almost",
        element: <CompleteRegister />
      },
      {
        path: "/profile/:id",
        element: <Profile />
      },
      {
        path: "/profile/:id/reviews",
        element: <Reviews />
      },
      {
        path: "/profile/newreview",
        element: <NewReview />
      },
      {
        path: "/profile/:id/gamesplayed",
        element: <ListGames />
      }
    ]
  }
])

export { router }