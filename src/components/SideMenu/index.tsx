import { AuthContext } from "../../contexts/AuthContext"
import { useContext, useEffect, useState } from "react"
import { FaUser } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../services/firebaseConnection";
import { signOut } from "firebase/auth";

interface InfoSideProps {
  idUser: string,
  username: string,
  photo: string
}

export function SideMenu({ idUser }: { idUser: string }) {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const userAuth = useParams()
  const [userInfo, setUserInfo] = useState<InfoSideProps>()

  useEffect(() => {
    loadUserInfo()
  }, [userAuth])

  async function loadUserInfo() {
    const userRef = doc(db, "users", idUser)

    await getDoc(userRef)
      .then((snapshot) => {
        let tempInfo: InfoSideProps | null = null

        tempInfo = ({
          idUser: snapshot.data()?.idUser,
          username: snapshot.data()?.username,
          photo: snapshot.data()?.photo.url
        })

        setUserInfo(tempInfo)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  function handleLogout() {
    navigate("/")
    signOut(auth)
    return
  }

  return (
    <div className="flex flex-col items-center max-w-72 w-1/3 border-1 px-10 py-8 rounded-lg h-auto">
      {!userInfo?.photo && (
        <FaUser size={160} className="rounded-full border-1 p-4 text-slate-300 bg-bg_color -top-24 z-10" />
      )}
      {userInfo?.photo && (
        <div className="rounded-full border-1 -top-24 z-10 size-40 overflow-hidden">
          <img
            className="rounded-full object-cover w-full h-full"
            src={userInfo?.photo}
            alt="Foto de Perfil"
          />
        </div>
      )}
      <span className="text-xl text-main_color mt-4">
        {userInfo?.username}
      </span>

      {(user?.idUser === idUser) && (
        <button
          className="w-full bg-main_color text-bg_color font-bold rounded-lg h-10 mt-4 hover:bg-zinc-600 transition-colors duration-300"
          onClick={() => navigate(`/profile/${user.idUser}/edit`)}
        >EDITAR PERFIL</button>
      )}

      < ul className="w-full flex flex-col justify-center items-center gap-4 mt-4 text-main_color text-xl mb-10">
        <li
          className="w-full text-center py-2 hover:border-1 cursor-pointer rounded-lg"
          onClick={() => navigate(`/profile/${userAuth.id}/gamesplayed`)}
        >
          LISTA DE JOGOS
        </li>
        <li
          className="w-full text-center py-2 hover:border-1 cursor-pointer rounded-lg"
          onClick={() => navigate(`/profile/${userAuth.id}/reviews`)}
        >
          REVIEWS
        </li>
        <li
          className="w-full text-center py-2 hover:border-1 cursor-pointer rounded-lg"
          onClick={() => navigate(`/profile/${userAuth.id}/favorites`)}
        >
          JOGOS FAVORITOS
        </li>
      </ul>

      {(user?.idUser === idUser) && (
        <button
          className="w-full bg-secundary_color text-main_color font-medium rounded-lg h-10 mt-4 hover:bg-red-950 transition-colors duration-300"
          onClick={() => handleLogout()}
        >FINALIZAR SESSÃO</button>
      )}
    </div >
  )
}