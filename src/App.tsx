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
import { EditProfile } from "./pages/profile/editProfile"
import { NewFavorite } from "./pages/list/favorites/new"
import { Favorites } from "./pages/list/favorites"
import { Private } from "./routes/Private"
import { NotFound } from "./pages/notfound"
import { GameDetail } from "./pages/gamedetail"
import { Users } from "./pages/users"

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
        element: <Private><CompleteRegister /></Private>
      },
      {
        path: "/users",
        element: <Users />
      },
      {
        path: "/game/:id",
        element: <GameDetail />
      },
      {
        path: "/profile/:id",
        element: <Profile />
      },
      {
        path: "/profile/:id/edit",
        element: <Private><EditProfile /></Private>
      },
      {
        path: "/profile/:id/reviews",
        element: <Reviews />
      },
      {
        path: "/profile/newreview",
        element: <Private><NewReview /></Private>
      },
      {
        path: "/profile/:id/favorites",
        element: <Favorites />
      },
      {
        path: "/profile/newfavorite",
        element: <Private><NewFavorite /></Private>
      },
      {
        path: "/profile/:id/gamesplayed",
        element: <ListGames />
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
])

export { router }