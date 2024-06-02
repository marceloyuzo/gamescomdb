import { AuthContext } from "../../contexts/AuthContext"
import { useContext, useEffect, useState } from "react"
import { FaUser } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";

interface InfoSideProps {
  idUser: string,
  username: string,
  photo: string
}

export function SideMenu() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const userAuth = useParams()
  const [userInfo, setUserInfo] = useState<InfoSideProps>()

  useEffect(() => {
    loadUserInfo()
  }, [])

  async function loadUserInfo() {
    const userRef = collection(db, "users", `${userAuth.id}`, "userInfo")

    await getDocs(userRef)
      .then((snapshot) => {
        let tempInfo: InfoSideProps | null = null
        console.log("Número de documentos recuperados:", snapshot.size);

        snapshot.forEach((doc) => {
          tempInfo = ({
            idUser: doc.data().idUser,
            username: doc.data().username,
            photo: doc.data().photo.url
          })

        })

        if (!tempInfo) {
          return
        }

        setUserInfo(tempInfo)
      })
      .catch((error) => {
        console.log(error)
      })
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

      {(user?.idUser === userAuth.id) && (
        <button className="w-full bg-secundary_color text-bg_color font-bold rounded-lg h-10 mt-4">EDITAR PERFIL</button>
      )}

      < ul className="w-full flex flex-col justify-center items-center gap-4 mt-4 text-main_color text-xl mb-10">
        <li
          className="w-full text-center py-2 hover:border-1 cursor-pointer rounded-lg"
          onClick={() => navigate("")}
        >
          JOGOS FAVORITOS
        </li>
        <li
          className="w-full text-center py-2 hover:border-1 cursor-pointer rounded-lg"
          onClick={() => navigate(`/profile/${userAuth.id}/reviews`)}
        >
          REVIEWS
        </li>
        <li
          className="w-full text-center py-2 hover:border-1 cursor-pointer rounded-lg"
          onClick={() => navigate(`/profile/${userAuth.id}/gamesplayed`)}
        >
          LISTA DE JOGOS
        </li>
      </ul>
    </div >
  )
}