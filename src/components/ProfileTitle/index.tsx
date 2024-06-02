import { collection, getDocs } from "firebase/firestore"
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
  }, [])



  async function loadUserInfo() {
    const userInfoRef = collection(db, "users", `${userAuth.id}`, "userInfo")

    await getDocs(userInfoRef)
      .then((snapshot) => {
        let userInfoTemp: InfoSideProps | null = null

        snapshot.forEach((doc) => {
          userInfoTemp = ({
            idUser: doc.data().idUser,
            username: doc.data().username,
            photo: doc.data().photo
          })
        })

        if (!userInfoTemp) {
          return
        }
        setUserInfo(userInfoTemp)
      })
      .catch((error) => console.log(error))
  }

  return (
    <>
      {userInfo && (
        <div className="relative w-full border-1 rounded-lg py-4 px-6 mb-10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FaUser size={36} className="rounded-full p-2 text-bg_color bg-main_color" />
            <span className="text-main_color text-xl">{userInfo.username}</span>
          </div>
          <div className="absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2">
            <h2 className="text-main_color text-xl">{title}</h2>
          </div>
          <div className="flex items-center">
            <IoIosArrowRoundBack
              size={36}
              className="rounded-full text-main_color p-1 hover:bg-main_color hover:text-bg_color"
              onClick={() => navigate(`/profile/${userAuth.id}`)}
            />
          </div>
        </div>
      )}

    </>
  )
}