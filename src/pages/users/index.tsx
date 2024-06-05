import { useEffect, useState } from "react"
import { Container } from "../../components/Container"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../../services/firebaseConnection"
import { useNavigate } from "react-router-dom"

interface UsersProps {
  idUser: string,
  username: string,
  privacy: ["PUBLIC", "NOT LISTED", "PRIVATE"]
}

export function Users() {
  const [usersList, setUsersList] = useState<UsersProps[]>([])
  const [search, setSearch] = useState("")
  const [usersFilter, setUsersFilter] = useState<UsersProps[]>([])
  const searchParams = new URLSearchParams(window.location.search)
  const searchId = searchParams.get("username")
  const navigate = useNavigate()

  useEffect(() => {
    getUsers()

    if (searchId) {
      setSearch(searchId)
    }
  }, [searchId])

  useEffect(() => {
    if (usersList.length > 0) {
      const usersfilter = usersList.filter((user) => user.username.toLowerCase().startsWith(search.trim().toLowerCase()))

      setUsersFilter(usersfilter)
    }
  }, [search, usersList])

  async function getUsers() {
    const usersRef = collection(db, "users")
    const queryRef = query(usersRef, where("privacy", "==", "PUBLIC"))

    const snapshot = await getDocs(queryRef)

    if (snapshot.empty) {
      return
    }

    let listUsers = [] as UsersProps[]
    snapshot.forEach((doc) => {

      listUsers.push({
        idUser: doc.data().idUser,
        username: doc.data().username,
        privacy: doc.data().privacy
      })
    })
    setUsersList(listUsers)
    setUsersFilter(listUsers)
  }

  return (
    <Container>
      <main className="w-full mt-header py-16">
        <div className="relative w-full border-1 flex items-center py-8 rounded-lg mb-6 px-4">
          <div className="absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2">
            <h2 className="text-xl text-main_color">LISTA DE USUÁRIOS</h2>
          </div>
        </div>

        <div className="w-full flex flex-col justify-center items-center my-10">
          <div className="w-full relative flex justify-center items-center">
            <input
              className="w-full max-w-80 outline-none py-1 px-2 rounded-lg bg-bg_color border-1 text-main_color"
              type="text"
              placeholder="Pesquisar Usuário..."
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
            />
          </div>

          {usersFilter.length > 0 ? (
            <div className="mt-8 w-full grid grid-cols-3 text-main_color text-center gap-2">
              {usersFilter.map((user) => (
                <div key={user.idUser}>
                  <span
                    onClick={() => navigate(`/profile/${user.idUser}`)}
                    className="hover:bg-main_color hover:text-bg_color px-4 py-1 rounded-md transition duration-300 cursor-pointer"
                  >
                    {user.username}
                  </span>

                </div>
              ))}
            </div>
          ) : (
            <div className="text-main_color text-2xl fixed right-1/2 top-1/2 transform translate-x-1/2 translate-y-1/2">
              <h2>Não existe um usuário cadastrado com esse apelido :(</h2>
            </div>
          )}



        </div>
      </main>
    </Container>
  )
}