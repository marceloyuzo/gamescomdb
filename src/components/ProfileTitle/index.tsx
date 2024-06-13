import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { db } from "../../services/firebaseConnection"
import { FaUser } from "react-icons/fa"
import { IoIosArrowRoundBack } from "react-icons/io"

interface InfoSideProps {
  idUser: string,
  username: string,
  photo: string
}

export function ProfileTitle({ title }: { title: string }) {
  const userAuth = useParams()
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState<InfoSideProps>()

  useEffect(() => {
    loadUserInfo()
  }, [userAuth])



  async function loadUserInfo() {
    const userRef = doc(db, "users", `${userAuth.id}`)

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


  return (
    <>
      {userInfo && (
        <div className="relative w-full border-1 rounded-lg py-4 px-6 mb-10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {!userInfo?.photo && (
              <FaUser size={36} className="rounded-full border-1 p-4 text-slate-300 bg-bg_color -top-24 z-10" />
            )}
            {userInfo?.photo && (
              <div className="rounded-full border-1 z-10 size-14 overflow-hidden">
                <img
                  className="rounded-full object-cover w-full h-full"
                  src={userInfo?.photo}
                  alt="Foto de Perfil"
                />
              </div>
            )}
            <span className="text-main_color text-xl">{userInfo.username}</span>
          </div>
          <div className="absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2">
            <h2 className="text-main_color text-xl">{title}</h2>
          </div>
          <div className="flex items-center">
            <IoIosArrowRoundBack
              size={36}
              className="rounded-full text-main_color p-1 hover:bg-main_color hover:text-bg_color transition-colors duration-300"
              onClick={() => navigate(`/profile/${userAuth.id}`)}
            />
          </div>
        </div>
      )}

    </>
  )
}