import { AuthContext } from "../../contexts/AuthContext"
import { useContext } from "react"
import { FaUser } from "react-icons/fa";

export function SideMenu() {
  const { user } = useContext(AuthContext)

  return (
    <div className="flex flex-col items-center max-w-72 w-1/3 border-1 px-10 py-8 rounded-lg h-auto">
      <FaUser size={160} className="rounded-full border-1 p-4 text-slate-300" />
      <span className="text-xl text-main_color mt-4">
        {user?.username}
      </span>

      <button className="w-full bg-secundary_color text-bg_color font-bold rounded-lg h-10 mt-4">EDITAR PERFIL</button>

      <ul className="w-full flex flex-col justify-center items-center gap-4 mt-4 text-main_color text-xl mb-10">
        <li className="w-full text-center py-2 hover:border-1 cursor-pointer rounded-lg">
          JOGOS FAVORITOS
        </li>
        <li className="w-full text-center py-2 hover:border-1 cursor-pointer rounded-lg">
          REVIEWS
        </li>
        <li className="w-full text-center py-2 hover:border-1 cursor-pointer rounded-lg">
          LISTA DE JOGOS
        </li>
      </ul>
    </div>
  )
}